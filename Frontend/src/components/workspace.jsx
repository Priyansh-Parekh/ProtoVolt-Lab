import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiMove, FiZap, FiRotateCcw, FiRotateCw, FiTrash2, FiDownload, FiActivity } from "react-icons/fi";
import { useParams,useSearchParams  } from 'react-router-dom';

// Importing utils
import { error, info, success } from '../utils/toastify';
import api from '../utils/axios';

// --- Component Definition ---

const Workspace = () => {
    // --- Top-Level Constants ---
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

    // --- Hooks (State, Refs, Params) ---
    const canvasRef = useRef(null);
    const history = useRef([initialState]);
    const historyIndex = useRef(0);
    const { projectId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [state, setState] = useState(initialState);
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [jsonOutput, setJsonOutput] = useState('');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [circuitName, setCircuitName] = useState("Untitled")


    const view = searchParams.get("view");  // "admin"

    // --- State & History Management ---

    const setStateWithHistory = useCallback((updater) => {
        setState(currentState => {
            const newState = typeof updater === 'function' ? updater(currentState) : updater;
            if (historyIndex.current < history.current.length - 1) {
                history.current = history.current.slice(0, historyIndex.current + 1);
            }
            history.current.push(newState);
            historyIndex.current++;
            return newState;
        });
    }, []);

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


    // --- Core Application Logic (API & Main Features) ---

    const createCircuit = async (e) => {
        e.target.disabled = true;
        e.target.style.opacity = 0.5;
        const circuit = {
            name: circuitName,
            nodes: state.nodes,
            components: state.components,
        };

        try {
            const res = await api.post('/circuit/data/createCircuit', { circuit });
            if (res.data.success) {
                success(res.data.message);
                window.location.href = `/workspace/${res.data.circuit._id}`;
            } else {
                error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            error("Failed to save circuit. Please try again.");
        } finally {
            e.target.disabled = false;
            e.target.style.opacity = 1;
        }
    };

    const saveCircuit = async (e) => {
        console.log("Saving existing circuit...", projectId);
        e.target.disabled = true;
        e.target.style.opacity = 0.5;
        const circuitData = {
            name: circuitName,
            nodes: state.nodes,
            components: state.components,
        };

        try {
            // Your API call to update would go here
            const res = await api.post(`/circuit/data/updateCircuit`, { circuit:circuitData,_id:projectId });
            if(res.data.success){
                success(res.data.message);
            }else{
                error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            error("Failed to update circuit.");
        } finally {
            e.target.disabled = false;
            e.target.style.opacity = 1;
        }
    };

    const analyzeCircuit = async () => {
        info("Analyzing circuit...");

        try {
            const circuit_data = {
                name: circuitName,
                nodes: state.nodes,
                components: state.components,
            };

            const res = await api.post("/gemini/service/solveCircuit", { circuit_data });
            if (res.data.success) {
                setAnalysisResults(res.data.data)
                success("Analysis Done")
            }
            else {
                error(res.data.message);
            }
        } catch (err) {
            error("Server Error");
            console.log(err);
        }
    };

    const exportJson = () => {
        const circuit = {
            nodes: state.nodes,
            components: state.components.map(c => ({
                ...c,
                terminals: c.terminals.map(t => ({ id: t.id, nodeId: t.nodeId }))
            }))
        };
        setJsonOutput(JSON.stringify(circuit, null, 2));
        setShowJsonModal(true);
    };


    // --- Helper & Utility Functions ---

    const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

    const getMousePos = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    const getTerminalDef = (component, terminalId) => {
        let defs = [];

        switch (component.type) {
            case 'resistor':
                defs = [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }];
                break;
            case 'capacitor':
            case 'inductor':
                defs = [{ id: 't1', x: -20, y: 0 }, { id: 't2', x: 20, y: 0 }];
                break;
            case 'dc-source':
            case 'ac-source':
                defs = [{ id: 'positive', x: 20, y: 0 }, { id: 'negative', x: -20, y: 0 }];
                break;
            case 'ground':
                defs = [{ id: 'gnd', x: 0, y: -15 }];
                break;
            case 'ammeter':
            case 'voltmeter':
                defs = [{ id: 't1', x: -20, y: 0 }, { id: 't2', x: 20, y: 0 }];
                break;
            case 'transistor-npn':
                defs = [
                    { id: 'collector', x: 0, y: 20 },
                    { id: 'base', x: -20, y: 0 },
                    { id: 'emitter', x: 20, y: 0 }
                ];
                break;
            case 'and-gate':
            case 'or-gate':
            case 'nand-gate':
            case 'nor-gate':
            case 'xor-gate':
                defs = [
                    { id: 'input1', x: -20, y: -10 },
                    { id: 'input2', x: -20, y: 10 },
                    { id: 'output', x: 20, y: 0 }
                ];
                break;
            case 'not-gate':
                defs = [
                    { id: 'input', x: -20, y: 0 },
                    { id: 'output', x: 20, y: 0 }
                ];
                break;
        }

        return defs.find(d => d.id === terminalId);
    };


    const getAbsoluteTerminalPos = (component, terminalDef) => {
        const angle = (component.rotation || 0) * Math.PI / 180;
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
            if (!comp.position) continue;
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
            if (comp.terminals) {
                comp.terminals.forEach(term => {
                    if (term.nodeId === nodeId) {
                        terminals.push({ componentId: comp.id, terminalId: term.id });
                    }
                });
            }
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


    // --- Canvas Drawing Functions ---

    const drawComponent = useCallback((component, ctx, selectedComponentId, selectedNodeId, wiringStartNodeId) => {
        if (!component || !component.position) return;
        ctx.save();
        ctx.translate(component.position.x, component.position.y);
        ctx.rotate((component.rotation || 0) * Math.PI / 180);
        ctx.strokeStyle = selectedComponentId === component.id ? '#FFD700' : '#E0FFFF';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#1F2937';

        switch (component.type) {
            case 'resistor':
                ctx.beginPath();
                ctx.moveTo(-30, 0);
                ctx.lineTo(-20, 0);
                ctx.lineTo(-15, -5);
                ctx.lineTo(-10, 5);
                ctx.lineTo(-5, -5);
                ctx.lineTo(0, 5);
                ctx.lineTo(5, -5);
                ctx.lineTo(10, 5);
                ctx.lineTo(15, -5);
                ctx.lineTo(20, 0);
                ctx.lineTo(30, 0);
                ctx.stroke();
                break;

            case 'capacitor':
                ctx.beginPath();
                ctx.moveTo(-20, 0);
                ctx.lineTo(-10, 0);
                ctx.moveTo(10, 0);
                ctx.lineTo(20, 0);
                ctx.moveTo(-10, -15);
                ctx.lineTo(-10, 15);
                ctx.moveTo(10, -15);
                ctx.lineTo(10, 15);
                ctx.stroke();
                break;

            case 'inductor':
                ctx.beginPath();
                ctx.moveTo(-20, 0);
                let start = -10;
                for (let i = 0; i < 4; i++) {
                    ctx.arc(start + i * 5, 0, 5, Math.PI, 0, false);
                }
                ctx.lineTo(20, 0);
                ctx.stroke();
                break;

            case 'dc-source':
                ctx.beginPath();
                ctx.moveTo(-20, 0);
                ctx.lineTo(-10, 0);
                ctx.moveTo(10, 0);
                ctx.lineTo(20, 0);
                ctx.moveTo(-10, -10);
                ctx.lineTo(-10, 10);
                ctx.moveTo(10, -15);
                ctx.lineTo(10, 15);
                ctx.stroke();
                break;

            case 'ac-source':
                ctx.beginPath();
                ctx.moveTo(-20, 0);
                ctx.lineTo(20, 0);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-6, 0);
                for (let x = -6; x <= 6; x += 1) {
                    ctx.lineTo(x, Math.sin((x / 6) * Math.PI) * 4);
                }
                ctx.stroke();
                break;

            case 'ground':
                ctx.beginPath();
                ctx.moveTo(0, -15);
                ctx.lineTo(0, 0);
                ctx.moveTo(-15, 0);
                ctx.lineTo(15, 0);
                ctx.moveTo(-10, 5);
                ctx.lineTo(10, 5);
                ctx.moveTo(-5, 10);
                ctx.lineTo(5, 10);
                ctx.stroke();
                break;

            case 'ammeter':
            case 'voltmeter':
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.font = "12px Arial";
                ctx.fillStyle = "#E0FFFF";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(component.type === 'ammeter' ? 'A' : 'V', 0, 1);
                break;

            case 'transistor-npn':
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-20, 0);
                ctx.lineTo(0, 0);
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -20);
                ctx.moveTo(0, 0);
                ctx.lineTo(20, 20);
                ctx.moveTo(17, 17);
                ctx.lineTo(23, 23);
                ctx.stroke();
                break;

            // --- LOGIC GATES ---
            case 'and-gate':
                ctx.beginPath();
                ctx.moveTo(-20, -15);
                ctx.lineTo(0, -15);
                ctx.arc(0, 0, 15, -Math.PI / 2, Math.PI / 2);
                ctx.lineTo(-20, 15);
                ctx.closePath();
                ctx.stroke();
                break;

            case 'or-gate':
                ctx.beginPath();
                ctx.moveTo(-20, -15);
                ctx.quadraticCurveTo(0, 0, -20, 15);
                ctx.moveTo(-10, -15);
                ctx.quadraticCurveTo(20, 0, -10, 15);
                ctx.stroke();
                break;

            case 'not-gate':
                ctx.beginPath();
                ctx.moveTo(-20, -15);
                ctx.lineTo(-20, 15);
                ctx.lineTo(10, 0);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(15, 0, 5, 0, 2 * Math.PI);
                ctx.stroke();
                break;

            case 'nand-gate':
            case 'nor-gate':
                // Same as AND/OR but with bubble at output
                if (component.type.includes('and')) {
                    ctx.beginPath();
                    ctx.moveTo(-20, -15);
                    ctx.lineTo(0, -15);
                    ctx.arc(0, 0, 15, -Math.PI / 2, Math.PI / 2);
                    ctx.lineTo(-20, 15);
                    ctx.closePath();
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(-20, -15);
                    ctx.quadraticCurveTo(0, 0, -20, 15);
                    ctx.moveTo(-10, -15);
                    ctx.quadraticCurveTo(20, 0, -10, 15);
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(20, 0, 4, 0, 2 * Math.PI);
                ctx.stroke();
                break;

            case 'xor-gate':
                ctx.beginPath();
                ctx.moveTo(-22, -15);
                ctx.quadraticCurveTo(-10, 0, -22, 15);
                ctx.moveTo(-10, -15);
                ctx.quadraticCurveTo(20, 0, -10, 15);
                ctx.stroke();
                break;
        }

        ctx.restore();

        if (component.terminals) {
            component.terminals.forEach(terminal => {
                const node = state.nodes.find(n => n.id === terminal.nodeId);
                if (!node) return;
                ctx.fillStyle = (selectedNodeId === node.id || wiringStartNodeId === node.id) ? '#FFD700' : '#FF69B4';
                ctx.beginPath();
                ctx.arc(node.position.x, node.position.y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    }, [state]);



    const drawWires = useCallback((ctx, selectedNodeId) => {
        ctx.strokeStyle = '#AEFF00';
        ctx.lineWidth = 2;
        const allSegments = [];

        state.nodes.forEach(node => {
            const connectedTerminals = getAllTerminalsAtNode(node.id);
            connectedTerminals.forEach(terminalInfo => {
                const component = state.components.find(c => c.id === terminalInfo.componentId);
                if (!component || !component.position) return;
                const terminalDef = getTerminalDef(component, terminalInfo.terminalId);
                if (!terminalDef) return;

                const [termX, termY] = getAbsoluteTerminalPos(component, terminalDef);
                const nodePos = node.position;
                const isHorizontal = (component.rotation || 0) % 180 === 0;
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

    const resizeCanvas = useCallback(() => {
        const c = canvasRef.current;
        if (c) {
            c.width = c.clientWidth;
            c.height = c.clientHeight;
            draw();
        }
    }, [draw]);


    // --- Event Handlers ---

    const handlePropertyChange = (componentId, prop, key, value) => {
        setStateWithHistory(prev => ({ ...prev, components: prev.components.map(c => (c.id === componentId) ? { ...c, properties: { ...c.properties, [prop]: { ...c.properties[prop], [key]: value } } } : c) }));
    };

    const handleDragStart = (e, type) => e.dataTransfer.setData('componentType', type);

    const handleDrop = (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('componentType');
        if (type) createComponent(type, getMousePos(e).x, getMousePos(e).y);
    };

    const handleMouseDown = (e) => {
        const mousePos = getMousePos(e);
        if (state.wireMode) {
            const nearbyNode = findNearbyNode(mousePos.x, mousePos.y);
            if (!state.wiringStartNodeId) {
                if (nearbyNode) setState(prev => ({ ...prev, wiringStartNodeId: nearbyNode.id }));
                return;
            }
            setStateWithHistory(prev => {
                const newNodes = JSON.parse(JSON.stringify(prev.nodes));
                const newComponents = JSON.parse(JSON.stringify(prev.components));
                const startNodeId = prev.wiringStartNodeId;
                let endNodeId = nearbyNode ? nearbyNode.id : generateId('node');

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
            if (component) {
                setState(prev => ({ ...prev, draggedComponent: component, offset: { x: mousePos.x - component.position.x, y: mousePos.y - component.position.y }, selectedComponentId: component.id, selectedNodeId: null }));
            } else {
                setState(prev => ({ ...prev, selectedNodeId: findNearbyNode(mousePos.x, mousePos.y)?.id || null, selectedComponentId: null }));
            }
        }
    };

    const handleMouseMove = (e) => {
        if (!state.wireMode && state.draggedComponent) {
            updateComponentPosition(state.draggedComponent, getMousePos(e).x - state.offset.x, getMousePos(e).y - state.offset.y);
        }
    };

    const handleMouseUp = () => {
        if (state.draggedComponent) {
            setStateWithHistory(prev => ({ ...prev, draggedComponent: null }));
        }
    };

    const createComponent = (type, x, y) => {
        const component = {
            id: generateId('comp'),
            type,
            label: `${type.charAt(0).toUpperCase()}${state.components.filter(c => c.type === type).length + 1}`,
            position: { x, y },
            rotation: 0,
            properties: {},
            terminals: []
        };

        let terminalDefs = [];
        switch (type) {
            case 'resistor':
                terminalDefs = [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }];
                component.properties = { resistance: { value: "", unit: "" } };
                break;
            case 'capacitor':
                terminalDefs = [{ id: 't1', x: -20, y: 0 }, { id: 't2', x: 20, y: 0 }];
                component.properties = { capacitance: { value: "", unit: "" } };
                break;
            case 'inductor':
                terminalDefs = [{ id: 't1', x: -20, y: 0 }, { id: 't2', x: 20, y: 0 }];
                component.properties = { inductance: { value: "", unit: "" } };
                break;
            case 'dc-source':
                terminalDefs = [{ id: 'positive', x: 20, y: 0 }, { id: 'negative', x: -20, y: 0 }];
                component.properties = { voltage: { value: 9, unit: "V" } };
                break;
            case 'ac-source':
                terminalDefs = [{ id: 'positive', x: 20, y: 0 }, { id: 'negative', x: -20, y: 0 }];
                component.properties = { voltage: { value: "", unit: "V" }, frequency: { value: "", unit: "Hz" } };
                break;
            case 'ground':
                terminalDefs = [{ id: 'gnd', x: 0, y: -15 }];
                break;
            case 'ammeter':
            case 'voltmeter':
                terminalDefs = [{ id: 't1', x: -20, y: 0 }, { id: 't2', x: 20, y: 0 }];
                component.properties = { reading: { value: "", unit: type === 'ammeter' ? 'A' : 'V' } };
                break;
            case 'transistor-npn':
                terminalDefs = [
                    { id: 'collector', x: 0, y: 20 },
                    { id: 'base', x: -20, y: 0 },
                    { id: 'emitter', x: 20, y: 0 }
                ];
                component.properties = { beta: { value: "", unit: "" } };
                break;
            case 'and-gate':
            case 'or-gate':
            case 'nand-gate':
            case 'nor-gate':
            case 'xor-gate':
                terminalDefs = [
                    { id: 'input1', x: -20, y: -10 },
                    { id: 'input2', x: -20, y: 10 },
                    { id: 'output', x: 20, y: 0 }
                ];
                component.properties = { logicState: { value: "", unit: "" } };
                break;
            case 'not-gate':
                terminalDefs = [{ id: 'input', x: -20, y: 0 }, { id: 'output', x: 20, y: 0 }];
                component.properties = { logicState: { value: "", unit: "" } };
                break;
        }

        const newNodes = [];
        const newTerminals = [];
        terminalDefs.forEach(def => {
            const nodeId = generateId('node');
            const [nodeX, nodeY] = getAbsoluteNodePos(component, def);
            newNodes.push({ id: nodeId, position: { x: nodeX, y: nodeY } });
            newTerminals.push({ id: def.id, nodeId });
        });

        component.terminals = newTerminals;
        setStateWithHistory(prev => ({
            ...prev,
            nodes: [...prev.nodes, ...newNodes],
            components: [...prev.components, component]
        }));
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
                    const newId = generateId('node');
                    const termDef = getTerminalDef(item.component, item.terminal.id);
                    const [nodeX, nodeY] = getAbsoluteNodePos(item.component, termDef);
                    newNodes.push({ id: newId, position: { x: nodeX, y: nodeY } });
                    item.terminal.nodeId = newId;
                });
                return { ...prev, nodes: newNodes.filter(n => n.id !== prev.selectedNodeId), selectedNodeId: null };
            });
        }
    };


    // --- Lifecycle Effects ---

    // Effect for fetching initial circuit data
    useEffect(() => {
        const execute = async () => {
            try {
                const res = await api.get(`/circuit/data/getCircuit?id=${projectId}&view=${view}`);
                if (res.data.success) {
                    const data_circuit = res.data.circuit;
                    setCircuitName(data_circuit.name)
                    setStateWithHistory(prev => ({
                        ...prev,
                        components: data_circuit.components || [],
                        nodes: data_circuit.nodes || [],
                    }));
                } else {
                    error(res.data.message);
                }
            } catch (err) {
                console.error(err);
                error("Failed to fetch circuit. Please reload.");
            }
        };

        if (projectId && projectId !== "new") {
            execute();
        }
    }, [projectId, setStateWithHistory]);

    // Effect for handling canvas resize
    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    // Effect for drawing the canvas whenever the 'draw' function is stable and state changes
    useEffect(() => {
        draw();
    }, [draw]);

    // Effect for keyboard shortcuts (Undo/Redo)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showJsonModal) return;
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') { e.preventDefault(); handleUndo(); }
                else if (e.key === 'y') { e.preventDefault(); handleRedo(); }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo, showJsonModal]);


    // --- Return JSX ---
    return (
        <div className="flex flex-col  bg-[#111827] text-[#F3F4F6] overflow-hidden">
    
            {/* --- Top Section (Sidebar | [Header + (Canvas + Properties)]) --- */}
            <div className="flex flex-1 overflow-hidden">
    
                {/* 1. Components Sidebar (Left) */}
                <div className="w-56 flex-shrink-0 bg-[#1F2937] border-r border-[#4B5563] p-4 flex flex-col space-y-5 shadow-soft overflow-y-auto">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FBBF24] to-[#F97316]">Components</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Component Buttons */}
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'resistor')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M0 10H5L7.5 15L12.5 5L17.5 15L22.5 5L27.5 15L30 10H40" stroke="currentColor" strokeWidth="2" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">Resistor</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'dc-source')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M0 10H15M25 10H40M15 5V15M25 2V18" stroke="currentColor" strokeWidth="2" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">DC Source</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'ground')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M20 0V10M10 10H30M14 14H26M18 18H22" stroke="currentColor" strokeWidth="2" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">Ground</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'capacitor')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M0 10H15M25 10H40M15 0V20M25 0V20" stroke="currentColor" strokeWidth="2" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">Capacitor</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'inductor')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M0 10H5M5 10C7.5 0,12.5 20,15 10C17.5 0,22.5 20,25 10C27.5 0,32.5 20,35 10H40" stroke="currentColor" strokeWidth="2" fill="none" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">Inductor</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'ac-source')}><svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><path d="M0 10H12M28 10H40" stroke="currentColor" strokeWidth="2" /><circle cx="20" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M17 13C18.6667 8.33333 21.3333 8.33333 23 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">AC Source</span></div>
                        <div className="component-btn group col-span-2" draggable="true" onDragStart={(e) => handleDragStart(e, 'transistor-npn')}><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9CA3AF] group-hover:text-[#F97316] transition-colors duration-300"><circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 20H20M20 12V28M25 12L20 20L25 28" stroke="currentColor" strokeWidth="2" /><path d="M25 28L30 33M30 28L25 33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="12" y1="20" x2="0" y2="20" stroke="currentColor" strokeWidth="2" /><line x1="25" y1="8" x2="25" y2="0" stroke="currentColor" strokeWidth="2" /><line x1="30" y1="33" x2="40" y2="33" stroke="currentColor" strokeWidth="2" /></svg><span className="text-xs mt-2 text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors duration-300">Transistor NPN</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'ammeter')}><svg width="40" height="40" viewBox="0 0 40 40" className="text-[#9CA3AF] group-hover:text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="20" r="12" /><text x="20" y="25" fontSize="12" textAnchor="middle" fill="currentColor" stroke="none">A</text></svg><span className="text-xs mt-2">Ammeter</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'voltmeter')}><svg width="40" height="40" viewBox="0 0 40 40" className="text-[#9CA3AF] group-hover:text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="20" r="12" /><text x="20" y="25" fontSize="12" textAnchor="middle" fill="currentColor" stroke="none">V</text></svg><span className="text-xs mt-2">Voltmeter</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'and-gate')}><svg width="40" height="40" viewBox="0 0 40 40" className="text-[#9CA3AF] group-hover:text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12 H20 A8 8 0 0 1 20 28 H10 Z" /></svg><span className="text-xs mt-2">AND Gate</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'or-gate')}><svg width="40" height="40" viewBox="0 0 40 40" className="text-[#9CA3AF] group-hover:text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12 Q20 20 10 28 M10 12 C18 12, 28 16, 30 20 C28 24, 18 28, 10 28 Z" /></svg><span className="text-xs mt-2">OR Gate</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'not-gate')}><svg width="40" height="40" viewBox="0 0 40 40" className="text-[#9CA3AF] group-hover:text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12 L10 28 L26 20 Z" /><circle cx="30" cy="20" r="3" /></svg><span className="text-xs mt-2">NOT Gate</span></div>
                        <div className="component-btn group" draggable="true" onDragStart={(e) => handleDragStart(e, 'xor-gate')}><svg width="40" height="40" viewBox="0 0 40 40" className="text-[#9CA3AF] group-hover:text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12 C20 12, 28 16, 30 20 C28 24, 20 28, 12 28 Z" /><path d="M8 12 Q13 20 8 28" /></svg><span className="text-xs mt-2">XOR Gate</span></div>
                    </div>
                </div>
    
                {/* 2. Main Content Area (Center Column) */}
                <div className="flex-1 flex flex-col p-4 gap-4 overflow-auto-y">
                    
                    {/* Header/Toolbar */}
                    <div className="flex-shrink-0 flex items-center space-x-3 bg-[#1F2937] p-2 rounded-lg border border-[#4B5563] shadow-soft">
                        <div className="flex-1 flex justify-center">
                            <input type="text" value={circuitName} onChange={(e) => { setCircuitName(e.target.value); }} className="w-1/2 min-w-[200px] text-center rounded-md px-3 py-1.5 bg-[#111827] border border-[#4B5563] text-lg font-semibold text-[#F3F4F6] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition" placeholder="Circuit Name" />
                        </div>
                        <button onClick={() => setState(prev => ({ ...prev, wireMode: false }))} className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 ${!state.wireMode ? 'bg-gradient-to-r from-[#FBBF24] to-[#F97316] text-[#111827] shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-[#374151] border border-transparent text-[#9CA3AF] hover:border-[#F97316] hover:text-[#F3F4F6]'}`}><FiMove className="text-lg" /> Drag</button>
                        <button onClick={() => setState(prev => ({ ...prev, wireMode: true, wiringStartNodeId: null }))} className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 ${state.wireMode ? 'bg-[#F97316] text-[#F3F4F6] shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-[#374151] border border-transparent text-[#9CA3AF] hover:border-[#F97316] hover:text-[#F3F4F6]'}`}><FiZap className="text-lg" /> Wire</button>
                        <div className="flex-grow"></div>
                        <button onClick={handleUndo} disabled={historyIndex.current <= 0} className="flex items-center gap-2 px-4 py-2 hover:cursor-pointer rounded-md font-semibold transition-all duration-300 bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 hover:border-sky-500/70 disabled:opacity-50 disabled:cursor-not-allowed"><FiRotateCcw className="text-lg" /> Undo</button>
                        <button onClick={handleRedo} disabled={historyIndex.current >= history.current.length - 1} className="flex hover:cursor-pointer items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 hover:border-sky-500/70 disabled:opacity-50 disabled:cursor-not-allowed"><FiRotateCw className="text-lg" /> Redo</button>
                        <button onClick={deleteSelected} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold hover:cursor-pointer transition-all duration-300 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/70"><FiTrash2 className="text-lg" /> Delete</button>
                        <button onClick={exportJson} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold hover:cursor-pointer transition-all duration-300 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/70"><FiDownload className="text-lg" /> Export JSON</button>
                        <button onClick={analyzeCircuit} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold hover:cursor-pointer transition-all duration-300 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/70"><FiActivity className="text-lg" /> Analyze</button>
                        <button onClick={(e) => { if(view){error("maybe You Don't Have Access")}else{if (projectId === "new") createCircuit(e); else { saveCircuit(e) } }}} className="flex items-center hover:cursor-pointer gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/70"><FiDownload className="text-lg" /> Save</button>
                    </div>
    
                    {/* Canvas + Properties Row */}
                    <div className="flex flex-1 gap-4 overflow-hidden min-h-[80vh]">
                        
                        {/* Workspace Canvas (Primary Area) */}
                        <div className="flex-1 bg-[#1F2937] rounded-lg border border-[#4B5563] shadow-inner overflow-hidden">
                            <canvas ref={canvasRef} className="w-full h-full" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} />
                        </div>
    
                        {/* 3. Properties Panel (Right of Canvas) */}
                        <div className="w-72 flex-shrink-0 bg-[#1F2937] border border-[#4B5563] rounded-lg p-4 flex flex-col">
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
                                            {component.properties && Object.entries(component.properties).map(([key, prop]) => {
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
                                                    case 'logicstate': unitOptions = ['HIGH', 'LOW']; break;
                                                    case 'reading': unitOptions = ['V', 'A', 'mA']; break;
                                                    default: unitOptions = []; break;
                                                }
                                                return (
                                                    <div key={key} className="space-y-2 animate-fadeIn">
                                                        <strong className="capitalize text-[#F3F4F6]">{key.replace(/([A-Z])/g, ' $1')}</strong>
                                                        <div className="flex space-x-2 items-center">
                                                            <input type="text" placeholder="Value" value={(prop && prop.value) || ''} onChange={(e) => handlePropertyChange(component.id, key, 'value', e.target.value)} className="w-full rounded-md px-3 py-1.5 bg-[#111827] border border-[#4B5563] text-[#F3F4F6] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition" />
                                                            {key.toLowerCase() !== 'beta' &&
                                                                <select value={(prop && prop.unit) || ''} onChange={(e) => handlePropertyChange(component.id, key, 'unit', e.target.value)} className="w-24 rounded-md px-3 py-1.5 bg-[#111827] border border-[#4B5563] text-[#F3F4F6] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition">
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
                </div>
            </div>
    
            {/* --- Bottom Section (Analysis Results) --- */}
            <div className=" flex-shrink-0 bg-[#1F2937] border-t border-[#4B5563] p-4 flex flex-col gap-4">
                <h3 className="text-xl font-bold pb-2 border-b border-[#4B5563] bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#34D399]">
                    Analysis Results
                </h3>
                <div className="flex-1 overflow-y-auto">
                    {analysisResults && analysisResults.solved ? (
                        // SUCCESS VIEW
                        <>
                            <div className="bg-black/20 p-3 rounded-lg flex justify-between items-center mb-4">
                                <span className="text-sm text-[#D1D5DB]">Total Power Dissipated:</span>
                                <span className="font-mono text-lg font-bold text-white">
                                    {analysisResults.summary.total_power_dissipated}
                                </span>
                            </div>
                            <table className="w-full text-sm text-left text-[#9CA3AF]">
                                <thead className="text-xs text-[#D1D5DB] uppercase bg-[#374151] sticky top-0">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Component</th>
                                        <th scope="col" className="px-4 py-3 text-right">Voltage</th>
                                        <th scope="col" className="px-4 py-3 text-right">Current</th>
                                        <th scope="col" className="px-4 py-3 text-right">Power</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analysisResults.components.map(component => {
                                        const props = component.properties;
                                        const voltage = props.voltage_drop || props.voltage || (component.type === 'voltmeter' && props.reading);
                                        const current = props.current || (component.type === 'ammeter' && props.reading);
                                        const formatProp = (p) => p ? `${p.value} ${p.unit || ''}` : <span className="text-gray-500">N/A</span>;
                                        return (
                                            <tr key={component.id} className="border-b border-[#374151] hover:bg-[#374151]/40 transition-colors duration-150">
                                                <th scope="row" className="px-4 py-4 font-medium text-[#F3F4F6] whitespace-nowrap">{component.label}</th>
                                                <td className="px-4 py-4 text-right font-mono">{formatProp(voltage)}</td>
                                                <td className="px-4 py-4 text-right font-mono">{formatProp(current)}</td>
                                                <td className="px-4 py-4 text-right font-mono">{formatProp(props.power)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        // PLACEHOLDER OR ERROR VIEW
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            {analysisResults && !analysisResults.solved ? (
                                // Error View
                                <>
                                    <svg className="w-12 h-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p className="text-red-400">{analysisResults.error_message || "Analysis failed. Check circuit."}</p>
                                </>
                            ) : (
                                // Initial View
                                <>
                                    <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                    <p className="text-gray-400">Run analysis to view results.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
    
            {/* JSON Export Modal */}
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