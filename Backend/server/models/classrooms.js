import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    joinCode:{
        type: String,
        required: true,
    },
    assignments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
    }],
    announcements:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Announcement',
    }],
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    professors:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    image: {
        type: String, // store the image URL here
        default: null 
    }
},{timestamps: true});

const Classroom = mongoose.model('Classroom', classroomSchema,'Classrooms');

export default Classroom;