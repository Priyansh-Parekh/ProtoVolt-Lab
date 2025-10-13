import asyncHandler from  "express-async-handler";
import Classroom from "../../models/classrooms.js";
import Announcement from "../../models/announcements.js";

export const getAnnouncement = asyncHandler( async (req, res) => {
    const {classroomId, announcementId} = req.body;
    const userID = req.user_id;

    const classroom = await Classroom.findById(classroomId)
                        .populate("announcements")
                        .populate("owner","_id")
                        .populate("professors","_id")
                        .populate("students","_id");

    if(!classroom) {
        res.status(404);
        throw new Error("Classroom not found");
    }

    const isMember =
        classroom.owner._id.equals(userID) ||
        classroom.professors.some(p => p._id.equals(userID)) ||
        classroom.students.some(s => s._id.equals(userID));

    if (!isMember) {
        res.status(403);
        throw new Error("Access denied — you are not part of this classroom");
    }

    const annExistsInClass = classroom.announcements.some(a => a._id.toString() === announcementId);

    if(!annExistsInClass) {
        res.status(404);
        throw new Error("Announcement not found in this class");
    }

    const announcement = await Announcement.findById(announcementId)
                            .populate("professor","name email");

    if(!announcement) {
        res.status(404);
        throw new Error("Announcement not found, or has been deleted");
    }

    res.status(200).json(announcement);
});