import User from '../../models/users.js';

// OTP Verification Controller
const otpVer = async (req, res) => {
  try {
    // Use req.body instead of req.query
    const { otp, email, type } = req.body;

    // Validate input
    if (!otp || !email) {
      return res.json({ success: false, message: "OTP and email are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isOtpValid = otp === user.otp;
    const isOtpActive = Date.now() <= user.otpExpiresAt;

    if (isOtpValid && isOtpActive) {
      if (type === 'signUp') {
        user.verified = true;
        await user.save();
        return res.status(200).json({
          success: true,
          redirectUrl: "http://localhost:5173/user/login",
          message: "OTP verified. Account activated."
        });
      } else if (type === 'forgotPass') {
        // OTP valid for password reset
        return res.status(200).json({
          success: true,
          redirectUrl: "http://localhost:5173/user/edit",
          message: "OTP verified. Proceed to change password."
        });
      } else {
        return res.json({ success: false, message: "Invalid verification type" });
      }
    } else if (!isOtpValid && isOtpActive) {
      return res.json({ success: false, message: "Wrong OTP" });
    } else if (!isOtpActive) {
      if (type === "signUp") {
        await User.findByIdAndDelete(user._id);
        return res.json({ success: false, message: "OTP expired. try SignUp" });
      }else{
        return res.json({ success: false, message: "OTP expired. try Again " });
      }
    }

  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export default otpVer;
