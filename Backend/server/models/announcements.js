import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    professor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content:{
        type: String,
        require:true
    },
    file:{
        type:String
    }
},{timestamps: true});

const Announcement = mongoose.model('Announcement', announcementSchema,'Announcements');

export default Announcement;