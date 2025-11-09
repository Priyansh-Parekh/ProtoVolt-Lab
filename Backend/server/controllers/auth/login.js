import generateToken from "../../utils/tokenGenerator.js";
import User from "../../models/users.js";

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && user.verified && (await user.matchPassword(password))) {
      const token = generateToken(email);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.Cookie_Secure==="true",          // ✅ must be true on HTTPS (Render uses HTTPS)
        sameSite: process.env.Cookie_Same_site === "true" ? "none" : "lax",      // ✅ must be 'none' for cross-site cookies
        path: "/",             // ✅ recommended so cookie applies everywhere
      });

      res.status(200).json({
        success: true,
        message: "Successfully logged in!",
        redirectUrl: `${process.env.Frontend_Link}/dashboard`,
      });
    } else {
      if (!user?.verified) {
        return res.json({
          success: false,
          message: "User not verified or does not exist",
        });
      }
      res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default userLogin;
