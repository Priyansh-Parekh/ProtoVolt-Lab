import mongoose from "mongoose";

const ElectricalComponentSchema = new mongoose.Schema({
    id:{
        type:String,
        unique:true,
    },
    type: {
        type: String,
        enum:  ['resistor', 'capacitor', 'inductor','dc-source', 'ac-source', 'ground', 'transistor-npn'],
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
            type: mongoose.Schema.Types.ObjectId, 
            default: null,
        }
    }]
},{_id:false});


const dComponentSchema = new mongoose.Schema({
    id:{
        type:String,
        unique:true,
    },
    type: {
        type: String,
        enum: ['and-gate', 'or-gate', 'not-gate', 'xor-gate', 'nand-gate', 'nor-gate'],
        required: true,
    },
    label: { type: String, required: true },
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
            type: mongoose.Schema.Types.ObjectId, 
            default: null,
        }
    }]
},{_id:false});


const EComponent = mongoose.model('EComponent', ElectricalComponentSchema, 'EComponents');
const DComponent = mongoose.model('DComponent', dComponentSchema, 'DComponents');

export default{ EComponent,DComponent};
