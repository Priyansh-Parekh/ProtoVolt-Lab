import mongoose from "mongoose";
import Assignment from "../../models/assignments.js";
import StudAss from "../../models/studAss.js";
import User from "../../models/users.js";

const getClassAssStudData = async (req, res) => {
    try {
        const user = req.user;
        const { c_id } = req.query;

        if (!c_id) return res.status(404).json({ success: false, message: "Data Not Available" });

        const class_id = new mongoose.Types.ObjectId(c_id);

        const assignments = await Assignment.find({ classroom: class_id }).select("title dueDate");

        let assignmentsWithSubmissions = [];

        for (const ass of assignments) {
            const studAss = await StudAss.find({ assignment: ass._id })
                .select("owner completed")
                .populate("owner", "name");

            assignmentsWithSubmissions.push({
                _id: ass._id,
                title: ass.title,
                dueDate: ass.dueDate,
                students: studAss
            });
        }

        return res.status(200).json({
            success: true,
            message: "Assignments and submissions fetched successfully",
            assData: assignmentsWithSubmissions
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export default getClassAssStudData;