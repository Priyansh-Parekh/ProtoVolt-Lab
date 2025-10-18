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
    apparatus: {
        type: String,
    },
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    solutionCircuit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circuit',
    },
    subTabs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTab',
    },
    uploadedFiles: {
        type: String,
    }
}, { timestamps: true });
const Assignment = mongoose.model('Assignment', assignmentSchema, 'Assignments');

export default Assignment;