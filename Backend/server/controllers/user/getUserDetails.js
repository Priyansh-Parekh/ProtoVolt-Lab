import User from "../../models/users.js";

const getUserDetails = async (req, res) => {
  try {
    const user = req.user; 
    if (user === undefined) {
      return res.status(404).json({success: false, message: "User not found" });
    }
    else{
        return res.status(200).json({ success: true, user });
    }

  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default getUserDetails;