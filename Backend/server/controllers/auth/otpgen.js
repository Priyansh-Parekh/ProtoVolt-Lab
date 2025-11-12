import nodemailer from "nodemailer";
import { generateOtp, generateExpiry } from '../../utils/otpGenerator.js';
import User from '../../models/users.js';

const otpGen = async (req, res) => {
  try {
    const { type, email } = req.query;
    if (!email || !type) {
      return res.status(400).json({ success: false, message: "Missing email or type" });
    }

    const otp = generateOtp();
    const expiry = generateExpiry();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use env vars instead of hardcoding
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "ProtoVolt | OTP Verification",
      html: `<h2>Your OTP is ${otp}</h2>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent:", otp);

    const user = await User.findOne({ email });
    if (user) {
      user.otp = otp;
      user.otpExpiresAt = expiry;
      await user.save();
      return res.status(200).json({
        redirectUrl: `${process.env.FRONTEND_LINK}/user/otpVerification?type=${type}&email=${email}`,
      });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

export default otpGen;
