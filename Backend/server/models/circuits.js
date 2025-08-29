import mongoose from "mongoose";

const circuitSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    analysed:{
        type: Boolean,
        default: false,
    },
    circuitdata:{
        conponents:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Component',
        }]
    }
    
});

const Circuit = mongoose.model('Circuit', circuitSchema,'Circuits');

export default Circuit;