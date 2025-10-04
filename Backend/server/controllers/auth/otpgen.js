import nodemailer from "nodemailer";
import express from "express";
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (optional, for forms)


import {generateOtp , generateExpiry} from '../../utils/otpGenerator.js'
import User from '../../models/users.js'


const otpGen = async (req, res) => {
  const otp = generateOtp();
  const expiry = generateExpiry();
  const {type,email} = req.query;
  console.log(type)
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: "caggarwal025@gmail.com", 
        pass: "pzrt qgcf kmut ebzo"  // Gmail App Password -> not your account password
      }
    });

    const mailOptions = {
      from: "caggarwal025@gmail.com",
      to: "pppsvm0224@gmail.com",  
      subject: "OTP Verification",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP sent:", otp);
    if(type === "signUp"){

      let userExists = await User.findOne({ email });
      if(userExists){
        userExists.otp = otp;
        userExists.otpExpiresAt = expiry;
        userExists.save();
      }else{
        console.log("user not exist");
        
      }

      res.json({ success: true, message: "OTP sent successfully for registration" });
      res.redirect('http://localhost:5173/user/otpVerification')
    }
    

    // In production: save `otp` in DB/Redis with expiry and don't return it directly
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
};

export default otpGen;
