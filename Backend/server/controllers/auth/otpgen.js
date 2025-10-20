import nodemailer from "nodemailer";

import { generateOtp, generateExpiry } from '../../utils/otpGenerator.js'
import User from '../../models/users.js'


const otpGen = async (req, res) => {
  const otp = generateOtp();
  const expiry = generateExpiry();
  const { type, email } = req.query;
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
      to: `${email}`,
      subject: "ProtoVolt | OTP Verification",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px; color: #333;">
        <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #004aad; padding: 20px 30px; color: #fff;">
            <h1 style="margin: 0; font-size: 22px;">ProtoVolt</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="font-size: 20px; margin-bottom: 15px;">OTP Verification</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Dear User,<br><br>
              Thank you for choosing <strong>ProtoVolt</strong>. To complete your verification process, please use the OTP below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 15px 25px; background-color: #004aad; color: #fff; font-size: 24px; letter-spacing: 4px; border-radius: 8px;">
                <strong>${otp}</strong>
              </div>
            </div>
            <p style="font-size: 15px; line-height: 1.6; color: #555;">
              This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone for security reasons.
            </p>
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              If you did not request this verification, please ignore this email.
            </p>
          </div>
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 13px; color: #666;">
            © ${new Date().getFullYear()} ProtoVolt. All rights reserved.
          </div>
        </div>
      </div>
      `
    };
    

    await transporter.sendMail(mailOptions);

    console.log("OTP sent:", otp);

      let userExists = await User.findOne({ email });
      if (userExists) {
        userExists.otp = otp;
        userExists.otpExpiresAt = expiry;
        userExists.save();
        res.status(200).json({ redirectUrl: `http://localhost:5173/user/otpVerification?type=${type}&email=${email}` });
      } else {
        console.log("user not exist");
        res.status(200).json({ redirectUrl: 'http://localhost:5173/user/signup' })
      }
    
    // In production: save `otp` in DB/Redis with expiry and don't return it directly
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default otpGen;
