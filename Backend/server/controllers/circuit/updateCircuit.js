import Component from "../../models/components.js";
import Circuit from "../../models/circuits.js";
import Node from "../../models/nodes.js";

const updateCircuit = async (req, res) => {
    try {
        const { circuit, _id } = req.body; // _id is the ID of the Circuit document
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access"
            });
        }

        if (!circuit || !_id) {
            return res.status(400).json({
                success: false,
                message: "Circuit ID and data must be provided"
            });
        }

        const existingCircuit = await Circuit.findById(_id);

        if (!existingCircuit) {
            return res.status(404).json({
                success: false,
                message: "Circuit not found"
            });
        }

        if (existingCircuit.owner.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You do not have permission to edit this circuit"
            });
        }

        if (existingCircuit.circuitdata) {
            await Promise.all([
                Component.deleteMany({ _id: { $in: existingCircuit.circuitdata.components } }),
                Node.deleteMany({ _id: { $in: existingCircuit.circuitdata.nodes } })
            ]);
        }

        const createdNodes = await Promise.all(
            circuit.nodes.map(node =>
                Node.create({
                    id: node.id,
                    position: node.position,
                })
            )
        );

        const nodeIdMap = {};
        createdNodes.forEach(node => {
            nodeIdMap[node.id] = node._id;
        });

        const createdComps = await Promise.all(
            circuit.components.map(comp => {
                const terminals = comp.terminals.map(t => ({
                    id: t.id,
                    node: nodeIdMap[t.nodeId] || null, // Use the new MongoDB _id
                }));

                return Component.create({
                    id: comp.id,
                    type: comp.type,
                    label: comp.label,
                    position: comp.position,
                    properties: comp.properties,
                    terminals,
                });
            })
        );

        console.log(circuit.name);
        existingCircuit.name = circuit.name || existingCircuit.name; // Allow name updates
        existingCircuit.circuitdata = {
            components: createdComps.map(c => c._id),
            nodes: createdNodes.map(n => n._id),
        };
        existingCircuit.analysed = false;

        const updatedCircuit = await existingCircuit.save();

        return res.status(200).json({ // Use 200 OK for updates
            success: true,
            message: "Circuit updated successfully",
            circuit: updatedCircuit,
        });
    } catch (err) {
        console.error("Error updating circuit:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export default updateCircuit;