import mongoose from "mongoose";

const studAssSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subTabs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTab',
    }],
    studentFiles:[{
        type:String
    }],
    completed:{
        type:Boolean,
        default:false
    },
    assignment:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true,
    }
}, { timestamps: true });
const StudAss = mongoose.model('StudAss', studAssSchema, 'StudAss');

export default StudAss;