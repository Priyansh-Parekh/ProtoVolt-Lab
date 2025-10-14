// importing model
import Classroom from "../../models/classrooms.js";

//importing utilss
import generateJoinCode from "../../utils/joinCodeGenerator.js";

//importing cloudinary
import { uploadClassroomImageCloudinary } from "../../config/cloudinary.js";

const createClassroom = async (req, res) => {
    try {

        const { name, course, description } = req.body;
        const user = req.user;
        if (!name || !course ) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }
        if (user.role !== "professor") {
            return res.status(400).json({ success: false, message: "Unathorized access" });
        }

        let professors = [user._id];
        let owner = user._id;
        let url = null;
        if (req.file) {
            const result = await uploadClassroomImageCloudinary(req.file.path);
            url = result.secure_url || null;
        }
        let joinCode = generateJoinCode();
        console.log(url);

        const classroom = new Classroom({
            name,
            owner,
            course,
            description,
            joinCode,
            imageUrl: url,
            assignments: [],
            announcements: [],
            students: [],
            professors,
        });
        await classroom.save();

        user.classrooms.push(classroom._id);
        await user.save();

        return res.status(201).json({ success: true, message: "Classroom created successfully!", joinCode: classroom.joinCode });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default createClassroom;