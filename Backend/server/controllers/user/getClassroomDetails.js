import User from "../../models/users.js";

const getClassrooms = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ success: false, message: "Unauthorized. Please log in." });
    }

    //Populate the classrooms user is enrolled in
    const populatedUser = await User.findById(user._id)
      .populate({
        path: "classrooms",
        select: "name course description" // for the required fields that are in the dummi data on frontendd..
      });

    res.status(200).json({
      success: true,
      classrooms: populatedUser.classrooms
    });

  } catch (err) {
    console.error("Error fetching classrooms:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default getClassrooms;