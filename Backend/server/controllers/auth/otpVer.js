import express from "express";
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (optional, for forms)


import User from '../../models/users.js'


const otpVer = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ success: false, message: "OTP and email are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isOtpValid = otp === user.otp;
    const isOtpActive = Date.now() <= user.otpExpiresAt;

    if (isOtpValid && isOtpActive) {
      user.verified = true;
      await user.save();

      // Redirect user to frontend login page
      return res.redirect("http://localhost:5173/user/login");

    } else if (!isOtpValid && isOtpActive) {
      return res.status(400).json({ success: false, message: "Wrong OTP" });

    } else if (!isOtpActive) {
      await User.findByIdAndDelete(user._id);
      return res.status(400).json({ success: false, message: "OTP expired. User deleted." });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default otpVer;
