import nodemailer from "nodemailer";

// Utility function to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const otpGen = async (req, res) => {
  const otp = generateOTP();

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
    res.json({ success: true, message: "OTP sent successfully" });

    // In production: save `otp` in DB/Redis with expiry and don't return it directly
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
};

export default otpGen;
