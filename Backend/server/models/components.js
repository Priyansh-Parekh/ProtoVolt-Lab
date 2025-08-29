import mongoose from "mongoose";

const componentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['resistor', 'capacitor', 'led', 'dc-source', 'ground', 'transistor-npn'],
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
        nodeId: {
            type: mongoose.Schema.Types.ObjectId, // This will store the unique ID of the node it's connected to.
            default: null,
        }
    }]
});

const Component = mongoose.model('Component', componentSchema, 'Components');

export default Component;
