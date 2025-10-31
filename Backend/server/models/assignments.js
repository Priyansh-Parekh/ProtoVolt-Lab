import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    assignedApparatus: [{
        type: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1, // Good practice to ensure quantity is positive
            default: 1
        },
        _id: false
    }],
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    solutionCircuit:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circuit',
    }],
    subTabs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTab',
    },
    uploadedFile: {
        type: String,
    },
    studentFiles:[{
        type:String
    }],
    classroom:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true,
    }
}, { timestamps: true });
const Assignment = mongoose.model('Assignment', assignmentSchema, 'Assignments');

export default Assignment;