    // Helper functions
    const getTerminalDef = (component, terminalId) => {
        let defs;
        if (component.type === 'resistor') defs = [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }];
        if (component.type === 'dc-source') defs = [{ id: 'positive', x: 20, y: 0 }, { id: 'negative', x: -20, y: 0 }];
        if (component.type === 'led') defs = [{ id: 'anode', x: 20, y: 0 }, { id: 'cathode', x: -20, y: 0 }];
        if (component.type === 'ground') defs = [{ id: 'gnd', x: 0, y: -15 }];
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

export  {getTerminalDef,getAbsoluteTerminalPos,findNearbyNode,findComponentAt,getAllTerminalsAtNode,mergeNodes};