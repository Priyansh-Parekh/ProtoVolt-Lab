import React, { useEffect, useRef, useState, useCallback } from 'react';
import './workspace.css'

const Workspace = () => {
    const canvasRef = useRef(null);
    const [state, setState] = useState({
        nodes: [],
        components: [],
        selectedComponentId: null,
        selectedNodeId: null,
        wireMode: false,
        wiringStartNodeId: null,
        draggedComponent: null,
        offset: { x: 0, y: 0 }
    });
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [jsonOutput, setJsonOutput] = useState('');

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
            defs = [
                { id: 'gnd', x: 0, y: -15 }
            ];
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

    const findNearbyNode = (x, y, radius = 10) => {
        return state.nodes.find(node => {
            const dx = x - node.position.x;
            const dy = y - node.position.y;
            return dx * dx + dy * dy < radius * radius;
        });
    };

    const findComponentAt = (x, y) => {
        for (let i = state.components.length - 1; i >= 0; i--) {
            const comp = state.components[i];
            if (x > comp.position.x - 30 && x < comp.position.x + 30 &&
                y > comp.position.y - 15 && y < comp.position.y + 15) {
                return comp;
            }
        }
        return null;
    };

    const getAllTerminalsAtNode = (nodeId) => {
        const terminals = [];
        state.components.forEach(comp => {
            comp.terminals.forEach(term => {
                if (term.nodeId === nodeId) {
                    terminals.push({ componentId: comp.id, terminalId: term.id });
                }
            });
        });
        return terminals;
    };

    const mergeNodes = (nodeAId, nodeBId) => {
        if (nodeAId === nodeBId) return;
        setState(prev => {
            const newState = { ...prev };
            newState.components.forEach(comp => {
                comp.terminals.forEach(term => {
                    if (term.nodeId === nodeBId) {
                        term.nodeId = nodeAId;
                    }
                });
            });
            newState.nodes = newState.nodes.filter(n => n.id !== nodeBId);
            return newState;
        });
    };

    // Drawing functions
    const drawComponent = useCallback((component, ctx, selectedComponentId, selectedNodeId, wiringStartNodeId) => {
        ctx.save();
        ctx.translate(component.position.x, component.position.y);
        ctx.rotate(component.rotation * Math.PI / 180);

        // Draw component body
        ctx.strokeStyle = selectedComponentId === component.id ? '#4f46e5' : '#333';
        ctx.lineWidth = 2;

        if (component.type === 'resistor') {
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-25, 0);
            ctx.lineTo(-22.5, 5);
            ctx.lineTo(-17.5, -5);
            ctx.lineTo(-12.5, 5);
            ctx.lineTo(-7.5, -5);
            ctx.lineTo(-2.5, 5);
            ctx.lineTo(2.5, -5);
            ctx.lineTo(7.5, 5);
            ctx.lineTo(10, 0);
            ctx.lineTo(30, 0);
            ctx.stroke();
        } else if (component.type === 'dc-source') {
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
            // Positive sign
            ctx.beginPath();
            ctx.moveTo(13, -2);
            ctx.lineTo(13, 2);
            ctx.moveTo(11, 0);
            ctx.lineTo(15, 0);
            ctx.stroke();
        } else if (component.type === 'ground') {
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
        } else if (component.type === 'capacitor') {
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
        } else if (component.type === 'inductor') {
            ctx.beginPath();
            ctx.moveTo(-20, 0);
            ctx.lineTo(-15, 0);
            for (let i = -15; i <= 15; i += 5) {
                ctx.arc(i + 2.5, 0, 2.5, 0, Math.PI, false);
            }
            ctx.lineTo(20, 0);
            ctx.stroke();
        } else if (component.type === 'ac-source') {
            ctx.beginPath();
            ctx.moveTo(-20, 0);
            ctx.lineTo(20, 0);
            ctx.arc(0, 0, 10, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (component.type === 'transistor-npn') {
            ctx.beginPath();
            // Base line
            ctx.moveTo(-20, 0);
            ctx.lineTo(0, 0);
            // Collector line
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -20);
            // Emitter line
            ctx.moveTo(0, 0);
            ctx.lineTo(20, 20);
            // Arrow on emitter
            ctx.moveTo(17, 17);
            ctx.lineTo(23, 23);
            ctx.moveTo(23, 17);
            ctx.lineTo(17, 23);
            ctx.stroke();
        }


        ctx.restore();

        // Draw terminals
        component.terminals.forEach(terminal => {
            const node = state.nodes.find(n => n.id === terminal.nodeId);
            if (!node) return;
            ctx.fillStyle = (selectedNodeId === node.id || wiringStartNodeId === node.id) ? '#4f46e5' : '#333';
            ctx.beginPath();
            ctx.arc(node.position.x, node.position.y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }, [state.nodes]);

    const drawWires = useCallback((ctx, selectedNodeId) => {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        state.nodes.forEach(node => {
            const connectedTerminals = getAllTerminalsAtNode(node.id);

            // Only draw a dot if it's a junction of 2+ component terminals or a single terminal not at the component end
            if (connectedTerminals.length > 0) {
                const firstTerminalInfo = connectedTerminals[0];
                const component = state.components.find(c => c.id === firstTerminalInfo.componentId);
                if (component) {
                    const terminalDef = getTerminalDef(component, firstTerminalInfo.terminalId);
                    const [termX, termY] = getAbsoluteTerminalPos(component, terminalDef);

                    // Draw a junction dot if more than one wire meets or if the wire bends here.
                    if (connectedTerminals.length > 1 || (node.position.x !== termX && node.position.y !== termY)) {
                        ctx.fillStyle = selectedNodeId === node.id ? '#4f46e5' : '#333';
                        ctx.beginPath();
                        ctx.arc(node.position.x, node.position.y, 3, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }
            }

            connectedTerminals.forEach(terminalInfo => {
                const component = state.components.find(c => c.id === terminalInfo.componentId);
                if (!component) return;

                const terminalDef = getTerminalDef(component, terminalInfo.terminalId);
                if (!terminalDef) return;

                const [termX, termY] = getAbsoluteTerminalPos(component, terminalDef);

                ctx.beginPath();
                ctx.moveTo(node.position.x, node.position.y);

                // Check if the component is primarily horizontal or vertical
                // We use modulo 180 because 0 and 180 degrees are both horizontal orientations.
                if (component.rotation % 180 === 0) {
                    // It's horizontal, so draw vertical line first then horizontal
                    ctx.lineTo(node.position.x, termY);
                    ctx.lineTo(termX, termY);
                } else {
                    // It's vertical, so draw horizontal line first then vertical (original behavior)
                    ctx.lineTo(termX, node.position.y);
                    ctx.lineTo(termX, termY);
                }

                ctx.stroke();
            });
        });
    }, [state.nodes, state.components, getAllTerminalsAtNode, getAbsoluteTerminalPos]); // Added dependencies

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWires(ctx, state.selectedNodeId);
        state.components.forEach(comp => drawComponent(comp, ctx, state.selectedComponentId, state.selectedNodeId, state.wiringStartNodeId));
    }, [state, drawComponent, drawWires]);



    // Component creation
    const createComponent = (type, x, y) => {
        const component = {
            id: generateId('comp'),
            type: type,
            label: `${type.charAt(0).toUpperCase()}${state.components.filter(c => c.type === type).length + 1}`,
            position: { x, y },
            rotation: 0,
            properties: {}, // will set below
            terminals: []
        };

        let terminalDefs;
        if (type === 'resistor') {
            terminalDefs = [
                { id: 't1', x: -30, y: 0 },
                { id: 't2', x: 30, y: 0 }
            ];
            component.properties = {
                resistance: { value: "", unit: "" },
                voltage: { value: "", unit: "" },
                current: { value: "", unit: "" }
            };
        } else if (type === 'dc-source') {
            terminalDefs = [
                { id: 'positive', x: 20, y: 0 },
                { id: 'negative', x: -20, y: 0 }
            ];
            component.properties = {
                voltage: { value: 9, unit: "V" },
                internalResistance: { value: 0, unit: "Ω" }
            };
        } else if (type === 'ground') {
            terminalDefs = [
                { id: 'gnd', x: 0, y: -15 }
            ];
            component.properties = {};
        } else if (type === 'capacitor') {
            terminalDefs = [
                { id: 't1', x: -20, y: 0 },
                { id: 't2', x: 20, y: 0 }
            ];
            component.properties = {
                capacitance: { value: "", unit: "" },
                voltage: { value: "", unit: "" },
                charge: { value: "", unit: "" }
            };
        } else if (type === 'inductor') {
            terminalDefs = [
                { id: 't1', x: -20, y: 0 },
                { id: 't2', x: 20, y: 0 }
            ];
            component.properties = {
                inductance: { value: "", unit: "" },
                voltage: { value: "", unit: "" },
                current: { value: "", unit: "" }
            };
        } else if (type === 'ac-source') {
            terminalDefs = [
                { id: 'positive', x: 20, y: 0 },
                { id: 'negative', x: -20, y: 0 }
            ];
            component.properties = {
                voltage: { value: "", unit: "" },
                frequency: { value: "", unit: "" }
            };
        } else if (type === 'transistor-npn') {
            terminalDefs = [
                { id: 'collector', x: 0, y: 20 },
                { id: 'base', x: -20, y: 0 },
                { id: 'emitter', x: 20, y: 0 }
            ];
            component.properties = {
                beta: { value: "", unit: "" }
            };
        }

        const newNodes = [];
        const newTerminals = [];
        terminalDefs.forEach(def => {
            const nodeId = generateId('node');
            const [absX, absY] = getAbsoluteTerminalPos(component, def);
            newNodes.push({ id: nodeId, position: { x: absX, y: absY } });
            newTerminals.push({ id: def.id, nodeId: nodeId });
        });

        component.terminals = newTerminals;

        setState(prev => ({
            ...prev,
            nodes: [...prev.nodes, ...newNodes],
            components: [...prev.components, component]
        }));
    };

    const updateComponentPosition = (component, x, y) => {
        setState(prev => {
            const newState = { ...prev };
            const comp = newState.components.find(c => c.id === component.id);
            if (comp) {
                comp.position.x = x;
                comp.position.y = y;
                comp.terminals.forEach(terminal => {
                    const node = newState.nodes.find(n => n.id === terminal.nodeId);
                    if (node) {
                        const [absX, absY] = getAbsoluteTerminalPos(comp, getTerminalDef(comp, terminal.id));
                        node.position.x = absX;
                        node.position.y = absY;
                    }
                });
            }
            return newState;
        });
    };

    const deleteSelected = () => {
        if (state.selectedComponentId) {
            const compToDelete = state.components.find(c => c.id === state.selectedComponentId);
            if (!compToDelete) return;

            setState(prev => {
                const newState = { ...prev };
                compToDelete.terminals.forEach(term => {
                    const allConnections = getAllTerminalsAtNode(term.nodeId);
                    const otherConnections = allConnections.filter(c => c.componentId !== compToDelete.id);
                    if (otherConnections.length === 0) {
                        newState.nodes = newState.nodes.filter(n => n.id !== term.nodeId);
                    }
                });

                newState.components = newState.components.filter(c => c.id !== state.selectedComponentId);
                return newState;
            });
            setState(prev => ({ ...prev, selectedComponentId: null }));
        } else if (state.selectedNodeId) {
            const nodeToDeleteId = state.selectedNodeId;
            setState(prev => {
                const newState = { ...prev };
                const terminalsToDetach = [];
                newState.components.forEach(comp => {
                    comp.terminals.forEach(term => {
                        if (term.nodeId === nodeToDeleteId) {
                            terminalsToDetach.push({ component: comp, terminal: term });
                        }
                    });
                });

                terminalsToDetach.forEach(item => {
                    const newId = generateId('node');
                    const termDef = getTerminalDef(item.component, item.terminal.id);
                    const [absX, absY] = getAbsoluteTerminalPos(item.component, termDef);
                    newState.nodes.push({ id: newId, position: { x: absX, y: absY } });
                    item.terminal.nodeId = newId;
                });

                newState.nodes = newState.nodes.filter(n => n.id !== nodeToDeleteId);
                return newState;
            });
            setState(prev => ({ ...prev, selectedNodeId: null }));
        }
    };

    // Event handlers
    const handleDragStart = (e, type) => {
        e.dataTransfer.setData('componentType', type);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('componentType');
        const mousePos = getMousePos(e);
        if (type) {
            createComponent(type, mousePos.x, mousePos.y);
        }
    };

    const handleMouseDown = (e) => {
        const mousePos = getMousePos(e);

        if (state.wireMode) {
            const nearbyNode = findNearbyNode(mousePos.x, mousePos.y);
            if (!state.wiringStartNodeId) {
                if (nearbyNode) {
                    setState(prev => ({ ...prev, wiringStartNodeId: nearbyNode.id }));
                }
            } else {
                if (nearbyNode) {
                    mergeNodes(state.wiringStartNodeId, nearbyNode.id);
                    setState(prev => ({ ...prev, wiringStartNodeId: null }));
                } else {
                    const newNodeId = generateId('node');
                    setState(prev => ({
                        ...prev,
                        nodes: [...prev.nodes, { id: newNodeId, position: { x: mousePos.x, y: mousePos.y } }]
                    }));
                    mergeNodes(state.wiringStartNodeId, newNodeId);
                    setState(prev => ({ ...prev, wiringStartNodeId: null }));
                }
            }
        } else {
            const component = findComponentAt(mousePos.x, mousePos.y);
            if (component) {
                setState(prev => ({
                    ...prev,
                    draggedComponent: component,
                    offset: { x: mousePos.x - component.position.x, y: mousePos.y - component.position.y },
                    selectedComponentId: component.id,
                    selectedNodeId: null
                }));
            } else {
                const nearbyNode = findNearbyNode(mousePos.x, mousePos.y);
                setState(prev => ({
                    ...prev,
                    selectedNodeId: nearbyNode ? nearbyNode.id : null,
                    selectedComponentId: null
                }));
            }
        }
    };

    const handleMouseMove = (e) => {
        if (!state.wireMode && state.draggedComponent) {
            const mousePos = getMousePos(e);
            const newX = mousePos.x - state.offset.x;
            const newY = mousePos.y - state.offset.y;
            updateComponentPosition(state.draggedComponent, newX, newY);
        }
    };

    const handleMouseUp = () => {
        setState(prev => ({ ...prev, draggedComponent: null }));
    };

    const toggleWireMode = () => {
        setState(prev => ({
            ...prev,
            wireMode: !prev.wireMode,
            wiringStartNodeId: null
        }));
    };

    const exportJson = () => {
        const exportData = {
            nodes: state.nodes,
            components: state.components.map(c => ({
                ...c,
                terminals: c.terminals.map(t => ({ id: t.id, nodeId: t.nodeId }))
            }))
        };
        setJsonOutput(JSON.stringify(exportData, null, 2));
        setShowJsonModal(true);
    };

    // Canvas resize
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
    }, []);

    const handlePropertyChange = (componentId, prop, key, value) => {
        setState(prev => {
            const newComponents = prev.components.map(c => {
                if (c.id === componentId) {
                    return {
                        ...c,
                        properties: {
                            ...c.properties,
                            [prop]: { ...c.properties[prop], [key]: value }
                        }
                    };
                }
                return c;
            });
            return { ...prev, components: newComponents };
        });
    };


    // Effects
    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    useEffect(() => {
        draw();
    }, [draw]);

    return (
        <div className="flex h-screen">
            {/* Component Library Sidebar */}
            <div className="w-48 bg-white border-r border-gray-200 p-4 flex flex-col space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Components</h2>

                {/* Component Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Resistor */}
                    <div
                        className="component-btn"
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, 'resistor')}
                    >
                        <svg
                            width="40"
                            height="20"
                            viewBox="0 0 40 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 10H5L7.5 15L12.5 5L17.5 15L22.5 5L27.5 15L30 10H40"
                                stroke="black"
                                strokeWidth="2"
                            />
                        </svg>
                        <span className="text-xs mt-1 text-gray-600">Resistor</span>
                    </div>

                    {/* DC Source */}
                    <div
                        className="component-btn"
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, 'dc-source')}
                    >
                        <svg
                            width="40"
                            height="20"
                            viewBox="0 0 40 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 10H15M25 10H40M15 5V15M25 2V18"
                                stroke="black"
                                strokeWidth="2"
                            />
                        </svg>
                        <span className="text-xs mt-1 text-gray-600">DC Source</span>
                    </div>

                    {/* Ground */}
                    <div
                        className="component-btn"
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, 'ground')}
                    >
                        <svg
                            width="40"
                            height="20"
                            viewBox="0 0 40 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M20 0V10M10 10H30M14 14H26M18 18H22"
                                stroke="black"
                                strokeWidth="2"
                            />
                        </svg>
                        <span className="text-xs mt-1 text-gray-600">Ground</span>
                    </div>

                    {/* Capacitor */}
                    <div
                        className="component-btn"
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, 'capacitor')}
                    >
                        <svg
                            width="40"
                            height="20"
                            viewBox="0 0 40 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 10H15M25 10H40M15 0V20M25 0V20"
                                stroke="black"
                                strokeWidth="2"
                            />
                        </svg>
                        <span className="text-xs mt-1 text-gray-600">Capacitor</span>
                    </div>

                    {/* Inductor */}
                    <div
                        className="component-btn"
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, 'inductor')}
                    >
                        <svg
                            width="40"
                            height="20"
                            viewBox="0 0 40 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 10H5M5 10C7.5 0,12.5 20,15 10C17.5 0,22.5 20,25 10C27.5 0,32.5 20,35 10H40"
                                stroke="black"
                                strokeWidth="2"
                            />
                        </svg>
                        <span className="text-xs mt-1 text-gray-600">Inductor</span>
                    </div>

                    {/* AC Source */}
                    <div
                        className="component-btn"
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, 'ac-source')}
                    >
                        <svg
                            width="40"
                            height="20"
                            viewBox="0 0 40 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 10H40"
                                stroke="black"
                                strokeWidth="2"
                            />
                            <circle cx="20" cy="10" r="8" stroke="black" strokeWidth="2" />
                        </svg>
                        <span className="text-xs mt-1 text-gray-600">AC Source</span>
                    </div>

                    {/* Transistor NPN */}
                    <div
                        className="component-btn"
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, 'transistor-npn')}
                    >
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M0 20H20M20 20V0M20 20L40 40" stroke="black" strokeWidth="2" />
                            <path d="M37 37L43 43M43 37L37 43" stroke="black" strokeWidth="2" />
                        </svg>
                        <span className="text-xs mt-1 text-gray-600">Transistor NPN</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Toolbar */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setState(prev => ({ ...prev, wireMode: false }))}
                        className={`text-white font-medium rounded-lg text-sm px-4 py-2 ${!state.wireMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 hover:bg-gray-500'}`}
                    >
                        Drag
                    </button>
                    <button
                        onClick={() => setState(prev => ({ ...prev, wireMode: true }))}
                        className={`text-white font-medium rounded-lg text-sm px-4 py-2 ${state.wireMode ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 hover:bg-gray-500'}`}
                    >
                        Wire
                    </button>
                    <button
                        onClick={deleteSelected}
                        className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        Delete Selected
                    </button>
                    <button
                        onClick={exportJson}
                        className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        Export JSON
                    </button>
                </div>


                {/* Canvas and Properties Panel */}
                <div className="flex-1 flex">
                    {/* Canvas */}
                    <div className="flex-1 p-4">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full rounded-lg border border-gray-300"
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        />
                    </div>

                    {/* Properties Panel */}
                    <div className="w-64 bg-white border-l border-gray-200 p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Properties</h3>
                        <div className="text-gray-600">
                            {state.selectedComponentId ? (
                                (() => {
                                    const component = state.components.find(
                                        (c) => c.id === state.selectedComponentId
                                    );
                                    if (!component) return 'Component not found.';

                                    return (
                                        <div className="space-y-2">
                                            <p>
                                                <strong>ID:</strong> {component.id}
                                            </p>
                                            <p>
                                                <strong>Label:</strong> {component.label}
                                            </p>
                                            <p>
                                                <strong>Type:</strong> {component.type}
                                            </p>
                                            {Object.entries(component.properties).map(([key, prop]) => (
                                                <div key={key} className="flex space-x-2 items-center">
                                                    <strong>{key}:</strong>
                                                    <input
                                                        type="text"
                                                        placeholder="Value"
                                                        value={prop.value}
                                                        onChange={(e) =>
                                                            handlePropertyChange(component.id, key, 'value', e.target.value)
                                                        }
                                                        className="border rounded px-1 w-16"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Unit"
                                                        value={prop.unit}
                                                        onChange={(e) =>
                                                            handlePropertyChange(component.id, key, 'unit', e.target.value)
                                                        }
                                                        className="border rounded px-1 w-16"
                                                    />
                                                </div>
                                            ))}

                                        </div>
                                    );
                                })()
                            ) : (
                                'Select a component to see its properties.'
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* JSON Output Modal */}
            {showJsonModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Circuit Data (JSON)</h3>
                            <button
                                onClick={() => setShowJsonModal(false)}
                                className="text-gray-500 hover:text-gray-800 text-2xl"
                            >
                                &times;
                            </button>
                        </div>
                        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto h-96">
                            {jsonOutput}
                        </pre>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Workspace;