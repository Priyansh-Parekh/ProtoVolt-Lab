import mongoose from "mongoose";
import StudAss from "../../models/studAss.js";
import SubTab from "../../models/subTab.js";

const getStudAss = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized Access" });
        }

        const { a_id } = req.query;
        
        if (!mongoose.isValidObjectId(a_id)) {
            return res.status(400).json({ success: false, message: "Invalid Assignment ID" });
        }
        
        const ass_Id = new mongoose.Types.ObjectId(a_id)

        const studentAssignment = await StudAss.findOne({
            assignment: ass_Id,
            owner: user._id
        }).populate("subTabs");


        if (!studentAssignment) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Your Work Found",
            studentAssignment
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export default getStudAss;