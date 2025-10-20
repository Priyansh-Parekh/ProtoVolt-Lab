import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiMove, FiZap, FiRotateCcw, FiRotateCw, FiTrash2, FiDownload, FiActivity } from "react-icons/fi";

//importing utils
import { error, success } from '../utils/toastify';
import api from '../utils/axios';
import { useParams } from 'react-router-dom';

const Workspace = () => {
    const canvasRef = useRef(null);
    const { projectId } = useParams(); 

    // This is the new, fixed distance for nodes from their component terminals.
    const NODE_OFFSET = 20;

    const initialState = {
        nodes: [],
        components: [],
        selectedComponentId: null,
        selectedNodeId: null,
        wireMode: false,
        wiringStartNodeId: null,
        draggedComponent: null,
        offset: { x: 0, y: 0 }
    };

    const [state, setState] = useState(initialState);
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [jsonOutput, setJsonOutput] = useState('');

    // NEW: State for analysis results
    const [analysisResults, setAnalysisResults] = useState([]);

    // History management
    const history = useRef([initialState]);
    const historyIndex = useRef(0);

    const setStateWithHistory = useCallback((updater) => {
        const newState = typeof updater === 'function' ? updater(state) : updater;
        if (historyIndex.current < history.current.length - 1) {
            history.current = history.current.slice(0, historyIndex.current + 1);
        }
        history.current.push(newState);
        historyIndex.current++;
        setState(newState);
    }, [state]);

    const handleUndo = useCallback(() => {
        if (historyIndex.current > 0) {
            historyIndex.current--;
            setState(history.current[historyIndex.current]);
        }
    }, []);

    const handleRedo = useCallback(() => {
        if (historyIndex.current < history.current.length - 1) {
            historyIndex.current++;
            setState(history.current[historyIndex.current]);
        }
    }, []);

    const analyzeCircuit = async () => {
        // Simulate an API call or heavy computation
        console.log("Analyzing circuit...");

        // Create dummy results based on the current components
        const results = state.components
            .filter(c => c.type !== 'ground') // Grounds don't have voltage/current properties in this context
            .map(component => ({
                id: component.id,
                label: component.label,
                voltage: (Math.random() * 12).toFixed(3), // Random voltage up to 12V
                current: (Math.random() * 0.1).toFixed(4), // Random current up to 100mA
            }));

        // Simulate a delay
        setTimeout(() => {
            setAnalysisResults(results);
            console.log("Analysis complete.");
        }, 1000);
    };


    // Utility functions
    const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

    const getMousePos = useCallback((e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    // Helper functions
    const getTerminalDef = (component, terminalId) => {
        let defs;
        if (component.type === 'resistor') {
            defs = [
                { id: 't1', x: -30, y: 0 },
                { id: 't2', x: 30, y: 0 }
            ];
        }
        if (component.type === 'dc-source') {
            defs = [
                { id: 'positive', x: 20, y: 0 },
                { id: 'negative', x: -20, y: 0 }
            ];
        }
        if (component.type === 'ground') {
            defs = [{ id: 'gnd', x: 0, y: -15 }];
        }
        if (component.type === 'capacitor') {
            defs = [
                { id: 't1', x: -20, y: 0 },
                { id: 't2', x: 20, y: 0 }
            ];
        }
        if (component.type === 'inductor') {
            defs = [
                { id: 't1', x: -20, y: 0 },
                { id: 't2', x: 20, y: 0 }
            ];
        }
        if (component.type === 'ac-source') {
            defs = [
                { id: 'positive', x: 20, y: 0 },
                { id: 'negative', x: -20, y: 0 }
            ];
        }
        if (component.type === 'transistor-npn') {
            defs = [
                { id: 'collector', x: 0, y: 20 },
                { id: 'base', x: -20, y: 0 },
                { id: 'emitter', x: 20, y: 0 }
            ];
        }
        return defs.find(d => d.id === terminalId);
    };

    const getAbsoluteTerminalPos = (component, terminalDef) => {
        const angle = component.rotation * Math.PI / 180;
        const rotatedX = terminalDef.x * Math.cos(angle) - terminalDef.y * Math.sin(angle);
        const rotatedY = terminalDef.x * Math.sin(angle) + terminalDef.y * Math.cos(angle);
        return [component.position.x + rotatedX, component.position.y + rotatedY];
    };

    const getAbsoluteNodePos = (component, terminalDef) => {
        const [termX, termY] = getAbsoluteTerminalPos(component, terminalDef);
        const vecX = termX - component.position.x;
        const vecY = termY - component.position.y;
        const mag = Math.sqrt(vecX * vecX + vecY * vecY);
        if (mag < 0.01) return [termX, termY];
        const normX = vecX / mag;
        const normY = vecY / mag;
        return [termX + normX * NODE_OFFSET, termY + normY * NODE_OFFSET];
    };

    const findNearbyNode = (x, y, radius = 10) => {
        return state.nodes.find(node => {
            const dx = x - node.position.x;
            const dy = y - node.position.y;
            return dx * dx + dy * dy < radius * radius;
        });
    };

    const findComponentAt = (x, y) => {
        const padding = 15;
        for (let i = state.components.length - 1; i >= 0; i--) {
            const comp = state.components[i];
            if (x > comp.position.x - 30 - padding && x < comp.position.x + 30 + padding &&
                y > comp.position.y - 15 - padding && y < comp.position.y + 15 + padding) {
                return comp;
            }
        }
        return null;
    };

    const getAllTerminalsAtNode = useCallback((nodeId) => {
        const terminals = [];
        state.components.forEach(comp => {
            comp.terminals.forEach(term => {
                if (term.nodeId === nodeId) {
                    terminals.push({ componentId: comp.id, terminalId: term.id });
                }
            });
        });
        return terminals;
    }, [state.components]);

    const getLineIntersection = (p1, p2, p3, p4) => {
        const den = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
        if (den === 0) return null;
        const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / den;
        const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / den;
        if (t > 0.01 && t < 0.99 && u > 0.01 && u < 0.99) {
            return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
        }
        return null;
    };

    const drawComponent = useCallback((component, ctx, selectedComponentId, selectedNodeId, wiringStartNodeId) => {
        ctx.save();
        ctx.translate(component.position.x, component.position.y);
        ctx.rotate(component.rotation * Math.PI / 180);
        ctx.strokeStyle = selectedComponentId === component.id ? '#FFD700' : '#E0FFFF';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#1F2937';
        ctx.fillRect(-25, -12, 50, 24);

        if (component.type === 'resistor') {
            ctx.beginPath();
            ctx.moveTo(-30, 0); ctx.lineTo(-20, 0); ctx.lineTo(-15, -5); ctx.lineTo(-10, 5); ctx.lineTo(-5, -5); ctx.lineTo(0, 5); ctx.lineTo(5, -5); ctx.lineTo(10, 5); ctx.lineTo(15, -5); ctx.lineTo(20, 0); ctx.lineTo(30, 0);
            ctx.stroke();
        } else if (component.type === 'dc-source') {
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(-10, 0); ctx.moveTo(10, 0); ctx.lineTo(20, 0); ctx.moveTo(-10, -10); ctx.lineTo(-10, 10); ctx.moveTo(10, -15); ctx.lineTo(10, 15);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(13, -2); ctx.lineTo(13, 2); ctx.moveTo(11, 0); ctx.lineTo(15, 0);
            ctx.stroke();
        } else if (component.type === 'ground') {
            ctx.beginPath();
            ctx.moveTo(0, -15); ctx.lineTo(0, 0); ctx.moveTo(-15, 0); ctx.lineTo(15, 0); ctx.moveTo(-10, 5); ctx.lineTo(10, 5); ctx.moveTo(-5, 10); ctx.lineTo(5, 10);
            ctx.stroke();
        } else if (component.type === 'capacitor') {
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(-10, 0); ctx.moveTo(10, 0); ctx.lineTo(20, 0); ctx.moveTo(-10, -15); ctx.lineTo(-10, 15); ctx.moveTo(10, -15); ctx.lineTo(10, 15);
            ctx.stroke();
        } else if (component.type === 'inductor') {
            const coilStartX = -10, coilEndX = 10, numCoils = 4;
            const coilWidth = (coilEndX - coilStartX) / numCoils, coilRadius = coilWidth / 2;
            ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(coilStartX, 0);
            for (let i = 0; i < numCoils; i++) { ctx.arc(coilStartX + (i * coilWidth) + coilRadius, 0, coilRadius, Math.PI, 0, false); }
            ctx.lineTo(20, 0);
            ctx.stroke();
        } else if (component.type === 'ac-source') {
            ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 0, 10, 0, 2 * Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-6, 0);
            for (let x = -6; x <= 6; x += 1) { ctx.lineTo(x, Math.sin((x / 6) * Math.PI) * 4); }
            ctx.stroke();
        } else if (component.type === 'transistor-npn') {
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(0, 0); ctx.moveTo(0, 0); ctx.lineTo(0, -20); ctx.moveTo(0, 0); ctx.lineTo(20, 20); ctx.moveTo(17, 17); ctx.lineTo(23, 23); ctx.moveTo(23, 17); ctx.lineTo(17, 23);
            ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 0, 10, 0, 2 * Math.PI); ctx.stroke();
        }

        ctx.restore();
        component.terminals.forEach(terminal => {
            const node = state.nodes.find(n => n.id === terminal.nodeId);
            if (!node) return;
            ctx.fillStyle = (selectedNodeId === node.id || wiringStartNodeId === node.id) ? '#FFD700' : '#FF69B4';
            ctx.beginPath(); ctx.arc(node.position.x, node.position.y, 4, 0, 2 * Math.PI); ctx.fill();
        });
    }, [state.nodes]);

    const drawWires = useCallback((ctx, selectedNodeId) => {
        ctx.strokeStyle = '#AEFF00';
        ctx.lineWidth = 2;
        const allSegments = [];

        state.nodes.forEach(node => {
            const connectedTerminals = getAllTerminalsAtNode(node.id);
            connectedTerminals.forEach(terminalInfo => {
                const component = state.components.find(c => c.id === terminalInfo.componentId);
                if (!component) return;
                const terminalDef = getTerminalDef(component, terminalInfo.terminalId);
                if (!terminalDef) return;

                const [termX, termY] = getAbsoluteTerminalPos(component, terminalDef);
                const nodePos = node.position;
                const isHorizontal = component.rotation % 180 === 0;
                const corner = isHorizontal ? { x: nodePos.x, y: termY } : { x: termX, y: nodePos.y };

                allSegments.push({ p1: { x: termX, y: termY }, p2: corner });
                allSegments.push({ p1: corner, p2: nodePos });
            });
        });

        const intersections = [];
        for (let i = 0; i < allSegments.length; i++) {
            for (let j = i + 1; j < allSegments.length; j++) {
                const seg1 = allSegments[i], seg2 = allSegments[j];
                const isSeg1Horizontal = Math.abs(seg1.p1.y - seg1.p2.y) < 1;
                const isSeg2Vertical = Math.abs(seg2.p1.x - seg2.p2.x) < 1;
                if ((isSeg1Horizontal && isSeg2Vertical) || (!isSeg1Horizontal && !isSeg2Vertical && isSeg1Horizontal !== isSeg2Vertical)) {
                    const intersection = getLineIntersection(seg1.p1, seg1.p2, seg2.p1, seg2.p2);
                    if (intersection) intersections.push({ ...intersection, verticalSegment: isSeg2Vertical ? seg2 : seg1 });
                }
            }
        }

        allSegments.forEach(seg => {
            const p1 = seg.p1, p2 = seg.p2;
            const isVertical = Math.abs(p1.x - p2.x) < 1;
            if (isVertical) {
                const segmentHops = intersections
                    .filter(p => p.verticalSegment.p1.x === p1.x && p.y > Math.min(p1.y, p2.y) && p.y < Math.max(p1.y, p2.y))
                    .sort((a, b) => Math.sign(p1.y - p2.y) * (a.y - b.y));
                let currentPos = p1;
                segmentHops.forEach(hop => {
                    ctx.beginPath(); ctx.moveTo(currentPos.x, currentPos.y); ctx.lineTo(hop.x, hop.y - 5); ctx.stroke();
                    ctx.beginPath(); ctx.arc(hop.x, hop.y, 5, Math.PI, 0, false); ctx.stroke();
                    currentPos = { x: hop.x, y: hop.y + 5 };
                });
                ctx.beginPath(); ctx.moveTo(currentPos.x, currentPos.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            } else {
                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
        });

        state.nodes.forEach(node => {
            if (getAllTerminalsAtNode(node.id).length > 1) {
                ctx.fillStyle = selectedNodeId === node.id ? '#4f46e5' : '#333';
                ctx.beginPath(); ctx.arc(node.position.x, node.position.y, 4, 0, 2 * Math.PI); ctx.fill();
            }
        });
    }, [state.nodes, state.components, getAllTerminalsAtNode]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWires(ctx, state.selectedNodeId);
        state.components.forEach(comp => drawComponent(comp, ctx, state.selectedComponentId, state.selectedNodeId, state.wiringStartNodeId));
    }, [state, drawComponent, drawWires]);

    const createComponent = (type, x, y) => {
        const component = { id: generateId('comp'), type: type, label: `${type.charAt(0).toUpperCase()}${state.components.filter(c => c.type === type).length + 1}`, position: { x, y }, rotation: 0, properties: {}, terminals: [] };
        let terminalDefs = [];
        if (type === 'resistor') {
            terminalDefs = [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }]; component.properties = { resistance: { value: "", unit: "" }, voltage: { value: "", unit: "" }, current: { value: "", unit: "" } };
        } else if (type === 'dc-source') {
            terminalDefs = [{ id: 'positive', x: 20, y: 0 }, { id: 'negative', x: -20, y: 0 }]; component.properties = { voltage: { value: 9, unit: "V" }, internalResistance: { value: 0, unit: "Ω" } };
        } else if (type === 'ground') {
            terminalDefs = [{ id: 'gnd', x: 0, y: -15 }]; component.properties = {};
        } else if (type === 'capacitor') {
            terminalDefs = [{ id: 't1', x: -20, y: 0 }, { id: 't2', x: 20, y: 0 }]; component.properties = { capacitance: { value: "", unit: "" }, voltage: { value: "", unit: "" }, charge: { value: "", unit: "" } };
        } else if (type === 'inductor') {
            terminalDefs = [{ id: 't1', x: -20, y: 0 }, { id: 't2', x: 20, y: 0 }]; component.properties = { inductance: { value: "", unit: "" }, voltage: { value: "", unit: "" }, current: { value: "", unit: "" } };
        } else if (type === 'ac-source') {
            terminalDefs = [{ id: 'positive', x: 20, y: 0 }, { id: 'negative', x: -20, y: 0 }]; component.properties = { voltage: { value: "", unit: "" }, frequency: { value: "", unit: "" } };
        } else if (type === 'transistor-npn') {
            terminalDefs = [{ id: 'collector', x: 0, y: 20 }, { id: 'base', x: -20, y: 0 }, { id: 'emitter', x: 20, y: 0 }]; component.properties = { beta: { value: "", unit: "" } };
        }
        const newNodes = []; const newTerminals = [];
        terminalDefs.forEach(def => {
            const nodeId = generateId('node');
            const [nodeX, nodeY] = getAbsoluteNodePos(component, def);
            newNodes.push({ id: nodeId, position: { x: nodeX, y: nodeY } });
            newTerminals.push({ id: def.id, nodeId: nodeId });
        });
        component.terminals = newTerminals;
        setStateWithHistory(prev => ({ ...prev, nodes: [...prev.nodes, ...newNodes], components: [...prev.components, component] }));
    };

    const updateComponentPosition = (component, x, y) => {
        setState(prev => {
            const newComponents = prev.components.map(c => (c.id === component.id) ? { ...c, position: { x, y } } : c);
            const newNodes = [...prev.nodes];
            const comp = newComponents.find(c => c.id === component.id);
            if (comp) {
                comp.terminals.forEach(terminal => {
                    const node = newNodes.find(n => n.id === terminal.nodeId);
                    if (node) {
                        const termDef = getTerminalDef(comp, terminal.id);
                        const [nodeX, nodeY] = getAbsoluteNodePos(comp, termDef);
                        node.position.x = nodeX;
                        node.position.y = nodeY;
                    }
                });
            }
            return { ...prev, components: newComponents, nodes: newNodes };
        });
    };

    const deleteSelected = () => {
        if (state.selectedComponentId) {
            setStateWithHistory(prev => {
                const compToDelete = prev.components.find(c => c.id === prev.selectedComponentId);
                if (!compToDelete) return prev;
                const nodesToKeep = new Set(prev.nodes.map(n => n.id));
                compToDelete.terminals.forEach(term => { if (getAllTerminalsAtNode(term.nodeId).length <= 1) { nodesToKeep.delete(term.nodeId); } });
                return { ...prev, components: prev.components.filter(c => c.id !== prev.selectedComponentId), nodes: prev.nodes.filter(n => nodesToKeep.has(n.id)), selectedComponentId: null };
            });
        } else if (state.selectedNodeId) {
            setStateWithHistory(prev => {
                const terminalsToDetach = [];
                prev.components.forEach(comp => comp.terminals.forEach(term => { if (term.nodeId === prev.selectedNodeId) terminalsToDetach.push({ component: comp, terminal: term }); }));
                if (terminalsToDetach.length <= 1) return { ...prev, selectedNodeId: null };
                const newNodes = [...prev.nodes];
                terminalsToDetach.forEach(item => {
                    const newId = generateId('node'); const termDef = getTerminalDef(item.component, item.terminal.id);
                    const [nodeX, nodeY] = getAbsoluteNodePos(item.component, termDef);
                    newNodes.push({ id: newId, position: { x: nodeX, y: nodeY } }); item.terminal.nodeId = newId;
                });
                return { ...prev, nodes: newNodes.filter(n => n.id !== prev.selectedNodeId), selectedNodeId: null };
            });
        }
    };

    const handleDragStart = (e, type) => e.dataTransfer.setData('componentType', type);
    const handleDrop = (e) => { e.preventDefault(); const type = e.dataTransfer.getData('componentType'); if (type) createComponent(type, getMousePos(e).x, getMousePos(e).y); };
    const handleMouseDown = (e) => {
        const mousePos = getMousePos(e);
        if (state.wireMode) {
            const nearbyNode = findNearbyNode(mousePos.x, mousePos.y);
            if (!state.wiringStartNodeId) { if (nearbyNode) setState(prev => ({ ...prev, wiringStartNodeId: nearbyNode.id })); return; }
            setStateWithHistory(prev => {
                const newNodes = JSON.parse(JSON.stringify(prev.nodes)); const newComponents = JSON.parse(JSON.stringify(prev.components));
                const startNodeId = prev.wiringStartNodeId; let endNodeId = nearbyNode ? nearbyNode.id : generateId('node');
                if (!nearbyNode) newNodes.push({ id: endNodeId, position: { x: mousePos.x, y: mousePos.y } });
                if (startNodeId && endNodeId && startNodeId !== endNodeId) {
                    newComponents.forEach(c => c.terminals.forEach(t => { if (t.nodeId === endNodeId) t.nodeId = startNodeId; }));
                    const finalNodes = newNodes.filter(n => n.id !== endNodeId);
                    return { ...prev, nodes: finalNodes, components: newComponents, wiringStartNodeId: null };
                }
                return { ...prev, wiringStartNodeId: null };
            });
        } else {
            const component = findComponentAt(mousePos.x, mousePos.y);
            if (component) setState(prev => ({ ...prev, draggedComponent: component, offset: { x: mousePos.x - component.position.x, y: mousePos.y - component.position.y }, selectedComponentId: component.id, selectedNodeId: null }));
            else setState(prev => ({ ...prev, selectedNodeId: findNearbyNode(mousePos.x, mousePos.y)?.id || null, selectedComponentId: null }));
        }
    };
    const handleMouseMove = (e) => { if (!state.wireMode && state.draggedComponent) updateComponentPosition(state.draggedComponent, getMousePos(e).x - state.offset.x, getMousePos(e).y - state.offset.y); };
    const handleMouseUp = () => { if (state.draggedComponent) setStateWithHistory(prev => ({ ...prev, draggedComponent: null })); };
    const exportJson = () => {
        // Create the circuit object
        const circuit = {
            nodes: state.nodes,
            components: state.components.map(c => ({
                ...c,
                terminals: c.terminals.map(t => ({ id: t.id, nodeId: t.nodeId }))
            }))
        };

        // Store the JSON string
        setJsonOutput(JSON.stringify(circuit, null, 2));

        // Show the JSON modal
        setShowJsonModal(true);
    };

    const createCircuit = async (e) => {
        e.target.disabled = true;
        e.target.style.opacity = 0.5;
        const circuit = {
            name: "hello",
            nodes: state.nodes,
            components: state.components.map(c => ({
                ...c,
                terminals: c.terminals.map(t => ({ id: t.id, nodeId: t.nodeId }))
            }))
        };
        console.log(circuit)

        try {
            const res = await api.post('/circuit/data/createCircuit', { circuit });

            if (res.data.success) {
                success(res.data.message);
                window.location.href = `http://localhost:5173/workspace/${res.data.circuit._id}`;
            } else {
                error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            error("Failed to save circuit. Please try again.");
        }
        e.target.disabled = true;
        e.target.style.opacity = 0.5;
    };



    const resizeCanvas = useCallback(() => { const c = canvasRef.current; if (c) { c.width = c.clientWidth; c.height = c.clientHeight; } }, []);
    const handlePropertyChange = (componentId, prop, key, value) => {
        setStateWithHistory(prev => ({ ...prev, components: prev.components.map(c => (c.id === componentId) ? { ...c, properties: { ...c.properties, [prop]: { ...c.properties[prop], [key]: value } } } : c) }));
    };

    useEffect(() => { resizeCanvas(); window.addEventListener('resize', resizeCanvas); draw(); return () => window.removeEventListener('resize', resizeCanvas); }, [resizeCanvas, draw]);
    useEffect(() => { draw(); }, [draw]);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showJsonModal) return;
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') { e.preventDefault(); handleUndo(); }
                else if (e.key === 'y') { e.preventDefault(); handleRedo(); }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => { window.removeEventListener('keydown', handleKeyDown); };
    }, [handleUndo, handleRedo, showJsonModal]);


    return (
        <div className="flex  bg-[#111827] text-[#F3F4F6]">
            <div className="w-56 bg-[#1F2937] border-r border-[#4B5563] p-4 flex flex-col space-y-5 shadow-soft">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FBBF24] to-[#F97316]">Components</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'resistor')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M0 10H5L7.5 15L12.5 5L17.5 15L22.5 5L27.5 15L30 10H40" stroke="currentColor" strokeWidth="2" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">Resistor</span></div>
                    <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'dc-source')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M0 10H15M25 10H40M15 5V15M25 2V18" stroke="currentColor" strokeWidth="2" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">DC Source</span></div>
                    <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'ground')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M20 0V10M10 10H30M14 14H26M18 18H22" stroke="currentColor" strokeWidth="2" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">Ground</span></div>
                    <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'capacitor')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M0 10H15M25 10H40M15 0V20M25 0V20" stroke="currentColor" strokeWidth="2" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">Capacitor</span></div>
                    <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'inductor')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M0 10H5M5 10C7.5 0,12.5 20,15 10C17.5 0,22.5 20,25 10C27.5 0,32.5 20,35 10H40" stroke="currentColor" strokeWidth="2" fill="none" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">Inductor</span></div>
                    <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'ac-source')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M0 10H12M28 10H40" stroke="currentColor" strokeWidth="2" /><circle cx="20" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M17 13C18.6667 8.33333 21.3333 8.33333 23 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">AC Source</span></div>
                    <div className="component-btn group col-span-2" draggable="true" onDragStart={(e) => handleDragStart(e, 'transistor-npn')}><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 20H20M20 12V28M25 12L20 20L25 28" stroke="currentColor" strokeWidth="2" /><path d="M25 28L30 33M30 28L25 33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="12" y1="20" x2="0" y2="20" stroke="currentColor" strokeWidth="2" /><line x1="25" y1="8" x2="25" y2="0" stroke="currentColor" strokeWidth="2" /><line x1="30" y1="33" x2="40" y2="33" stroke="currentColor" strokeWidth="2" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">Transistor NPN</span></div>
                </div>
            </div>
            <div className="flex-1 h-[130vh]  flex flex-col p-4 gap-4">
                <div className="flex items-center space-x-3 bg-[#1F2937] p-2 rounded-lg border border-[#4B5563] shadow-soft">
                    <button onClick={() => setState(prev => ({ ...prev, wireMode: false }))} className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 ${!state.wireMode ? 'bg-gradient-to-r from-[#FBBF24] to-[#F97316] text-[#111827] shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-[#374151] border border-transparent text-[#9CA3AF] hover:border-[#F97316] hover:text-[#F3F4F6]'}`}><FiMove className="text-lg" /> Drag</button>
                    <button onClick={() => setState(prev => ({ ...prev, wireMode: true, wiringStartNodeId: null }))} className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 ${state.wireMode ? 'bg-[#F97316] text-[#F3F4F6] shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-[#374151] border border-transparent text-[#9CA3AF] hover:border-[#F97316] hover:text-[#F3F4F6]'}`}><FiZap className="text-lg" /> Wire</button>
                    <div className="flex-grow"></div>
                    <button onClick={handleUndo} disabled={historyIndex.current <= 0} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 hover:border-sky-500/70 disabled:opacity-50 disabled:cursor-not-allowed"><FiRotateCcw className="text-lg" /> Undo</button>
                    <button onClick={handleRedo} disabled={historyIndex.current >= history.current.length - 1} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 hover:border-sky-500/70 disabled:opacity-50 disabled:cursor-not-allowed"><FiRotateCw className="text-lg" /> Redo</button>
                    <button onClick={deleteSelected} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/70"><FiTrash2 className="text-lg" /> Delete</button>
                    <button onClick={exportJson} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/70"><FiDownload className="text-lg" /> Export JSON</button>
                    <button onClick={analyzeCircuit} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/70"><FiActivity className="text-lg" /> Analyze</button>
                    <button onClick={(e) => { if(projectId==="New")createCircuit(e); else{saveCircuit(e)} }} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/70"><FiDownload className="text-lg" /> Save</button>
                </div>
                {/* REVISED LAYOUT: Main area is now a column for canvas/properties AND the new table */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 flex gap-4 overflow-hidden">
                        <div className="flex-1 bg-[#1F2937] rounded-lg border border-[#4B5563] shadow-inner overflow-hidden">
                            <canvas ref={canvasRef} className="w-full h-full" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} />
                        </div>
                        <div className="w-72 bg-[#1F2937] border border-[#4B5563] rounded-lg p-4 flex flex-col animate-fadeIn">
                            <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#4B5563] bg-clip-text text-transparent bg-gradient-to-r from-[#FBBF24] to-[#F97316]">Properties</h3>
                            <div className="text-[#9CA3AF] flex-1 overflow-y-auto">
                                {state.selectedComponentId ? (() => {
                                    const component = state.components.find(c => c.id === state.selectedComponentId);
                                    if (!component) return <p className="text-center mt-8">Component not found.</p>;
                                    return (
                                        <div className="space-y-4 text-sm">
                                            <div className="flex justify-between items-center"><strong className="text-[#F3F4F6]">ID:</strong><span className="font-mono bg-[#374151] px-2 py-1 rounded border border-[#4B5563]">{component.id}</span></div>
                                            <div className="flex justify-between items-center"><strong className="text-[#F3F4F6]">Label:</strong><span className="text-right">{component.label}</span></div>
                                            <div className="flex justify-between items-center"><strong className="text-[#F3F4F6]">Type:</strong><span className="text-right">{component.type}</span></div>
                                            <hr className="border-t border-[#4B5563] my-4" />
                                            {Object.entries(component.properties).map(([key, prop]) => {
                                                let unitOptions = [];
                                                switch (key.toLowerCase()) {
                                                    case 'resistance': case 'internalresistance': unitOptions = ['Ω', 'kΩ', 'MΩ']; break;
                                                    case 'charge': unitOptions = ['mC', 'μC', 'C', 'KC']; break;
                                                    case 'voltage': unitOptions = ['V', 'mV', 'kV']; break;
                                                    case 'current': unitOptions = ['A', 'mA', 'μA']; break;
                                                    case 'capacitance': unitOptions = ['F', 'μF', 'nF', 'pF']; break;
                                                    case 'inductance': unitOptions = ['H', 'mH', 'μH']; break;
                                                    case 'power': unitOptions = ['W', 'mW', 'kW']; break;
                                                    case 'frequency': unitOptions = ['Hz', 'kHz', 'MHz']; break;
                                                    default: unitOptions = []; break;
                                                }
                                                return (
                                                    <div key={key} className="space-y-2 animate-fadeIn">
                                                        <strong className="capitalize text-[#F3F4F6]">{key.replace(/([A-Z])/g, ' $1')}</strong>
                                                        <div className="flex space-x-2 items-center">
                                                            <input type="text" placeholder="Value" value={prop.value} onChange={(e) => handlePropertyChange(component.id, key, 'value', e.target.value)} className="w-full rounded-md px-3 py-1.5 bg-[#111827] border border-[#4B5563] text-[#F3F4F6] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition" />
                                                            {key.toLowerCase() !== 'beta' &&
                                                                <select value={prop.unit} onChange={(e) => handlePropertyChange(component.id, key, 'unit', e.target.value)} className="w-24 rounded-md px-3 py-1.5 bg-[#111827] border border-[#4B5563] text-[#F3F4F6] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition">
                                                                    <option value="">Unit</option>
                                                                    {unitOptions.map((unit) => (<option key={unit} value={unit}>{unit}</option>))}
                                                                </select>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })() : (
                                    <div className="flex items-center justify-center h-full text-center text-[#9CA3AF]"><p>Select a component to<br />view its properties.</p></div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* NEW: OBSERVATION TABLE PANEL */}
                    <div className="h-64 bg-[#1F2937] border border-[#4B5563] rounded-lg p-4 flex flex-col">
                        <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#4B5563] bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#34D399]">
                            Analysis Results
                        </h3>
                        <div className="flex-1 overflow-y-auto">
                            {analysisResults.length > 0 ? (
                                <table className="w-full text-sm text-left text-[#9CA3AF]">
                                    <thead className="text-xs text-[#D1D5DB] uppercase bg-[#374151]">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Component</th>
                                            <th scope="col" className="px-6 py-3">Voltage (V)</th>
                                            <th scope="col" className="px-6 py-3">Current (A)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analysisResults.map(result => (
                                            <tr key={result.id} className="bg-[#1F2937] border-b border-[#374151] hover:bg-[#374151]/50">
                                                <th scope="row" className="px-6 py-4 font-medium text-[#F3F4F6] whitespace-nowrap">{result.label}</th>
                                                <td className="px-6 py-4">{result.voltage}</td>
                                                <td className="px-6 py-4">{result.current}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex items-center justify-center h-full text-center text-[#9CA3AF]">
                                    <p>Click "Analyze" to see circuit measurements.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showJsonModal && (
                <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-[#1F2937] rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.5)] border border-[#4B5563] p-6 w-1/2 max-w-2xl flex flex-col">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#4B5563]">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FBBF24] to-[#F97316]">Circuit Data (JSON)</h3>
                            <button onClick={() => setShowJsonModal(false)} className="text-[#9CA3AF] hover:text-[#F97316] text-3xl font-light leading-none transition-colors"> &times; </button>
                        </div>
                        <pre className="bg-[#111827] p-4 rounded-md text-sm overflow-auto h-96 text-[#FBBF24] border border-[#4B5563]"><code>{jsonOutput}</code></pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workspace;