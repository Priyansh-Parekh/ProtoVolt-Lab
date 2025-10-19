import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema({
    id:{
        type:String,
        unique:true,
    },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    }
});

const Node = mongoose.model('Node', nodeSchema, 'Nodes');

export default Node;
