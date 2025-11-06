import mongoose from "mongoose";
import Classroom from "../../models/classrooms.js";
import Announcement from "../../models/announcements.js";
import { uploadAssignmentFilesCloudinary } from "../../config/cloudinary.js";

const createAnnouncement = async (req, res) => {
    const { c_id } = req.query;
    const { title, content } = req.body;
    const user = req.user;
    
    if(!user || user.role !== "professor") {
        return res.status(403).json({success: false, message: "Unauthorized access" });
    }

    if (!title || !content) {
        return res.status(400).json({success: false, message: "Title and content are required" });
    }

    let fileUrl = null;
    if (req.file) {
        const result = await uploadAssignmentFilesCloudinary(req.file.path);
        fileUrl = result.secure_url;
    }


    if (!mongoose.isValidObjectId(c_id)) {
        return res.status(400).json({success: false, message: "Invalid classroom ID" });
    }

    const cId = new mongoose.Types.ObjectId(c_id);

    const classroom = await Classroom.findById(cId);
    if (!classroom) {
        return res.status(404).json({success: false, message: "Classroom not found" });
    }

    const isProfessor = classroom.professors.includes(user._id);
    if (!isProfessor) {
        return res.status(403).json({success: false, message: "Only professors can create announcements" });
    }

    const announcement = await Announcement.create({
        title,
        content,
        professor: user._id,
        file: fileUrl 
    });

    classroom.announcements.push(announcement._id);
    await classroom.save();

    res.status(201).json({
        success:true,
        message: "Announcement created successfully",
        announcement
    });
};

export default createAnnouncement;