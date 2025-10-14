import Classroom from "../../models/classrooms.js"; // ✅ import Classroom model

const getClassrooms = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        if (!user.classrooms || user.classrooms.length === 0) {
            return res.status(200).json({
                success: true,
                message: "User is not enrolled in any classrooms.",
                classrooms: []
            });
        }

        // Fetch classrooms using the Classroom model
        const classrooms = await Classroom.find({ _id: { $in: user.classrooms } })
          .select("name course description image");

        res.status(200).json({
          success: true,
          message: "User's classrooms have been fetched successfully.",
          classrooms
        });
        
    } catch (err) {
        console.error("Error fetching classrooms:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export default getClassrooms;