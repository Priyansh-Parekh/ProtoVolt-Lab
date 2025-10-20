import mongoose from "mongoose";


const ComponentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['resistor', 'capacitor', 'inductor', 'dc-source', 'ac-source', 'ground', 'transistor-npn', 'and-gate', 'or-gate', 'not-gate', 'xor-gate', 'nand-gate', 'nor-gate'],
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    properties: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    terminals: [{
        id: {
            type: String,
            required: true,
        },
        node: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Node'
        }
    }]
});



const Component = mongoose.model('Component', ComponentSchema, 'Components');

export default Component;
