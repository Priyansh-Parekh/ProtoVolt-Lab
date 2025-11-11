import mongoose from "mongoose";
import Circuit from "./circuits.js";

const subTabSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true,
    },
    circuit:{
        type: mongoose.Schema.Types.ObjectId,
        ref:Circuit,
    }
});

const SubTab = mongoose.model('SubTab',subTabSchema,"SubTabs");

export default SubTab;