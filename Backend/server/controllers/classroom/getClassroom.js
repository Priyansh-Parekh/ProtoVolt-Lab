import mongoose from "mongoose";

// importing model
import User from "../../models/users.js";
import Classroom from "../../models/classrooms.js";
import Assignment from "../../models/assignments.js";
import Announcement from "../../models/announcements.js";

//importing utilss


const GetClassroom = async (req, res) => {
    try {

        const { _id } = req.query;
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        if (!_id) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }
        const classroomId = new mongoose.Types.ObjectId(_id);
        const exists = user.classrooms.includes(classroomId);

        if (!exists) return res.status(400).json({ success: false, message: "UnAuthorized Access" });


        const classroom = await Classroom.findById(classroomId)
            .select("name assignments announcements course")
            .populate({
                path: "assignments",
                select: "title professor description dueDate uploadedFiles createdAt",
                populate: {
                    path: "professor",
                    select: "name"
                }
            })
            .populate({
                path: "announcements",
                select: "title professor content createdAt",
                populate: {
                    path: "professor",
                    select: "name"
                }
            });




        if (!classroom) return res.status(400).json({ success: false, message: "No such Classroom Available" });

        return res.status(201).json({ success: true, message: "Classroom fetched successfully!", classroom });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default GetClassroom;