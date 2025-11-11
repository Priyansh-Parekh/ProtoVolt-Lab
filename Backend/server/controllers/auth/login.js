import generateToken from "../../utils/tokenGenerator.js";
import User from "../../models/users.js";

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && user.verified && (await user.matchPassword(password))) {
      const token = generateToken(email);

      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // only true in production (Render + Vercel)
        sameSite: isProduction ? "none" : "lax", // allow cross-site for production (Render <-> Vercel)
        path: "/",
      });

      res.status(200).json({
        success: true,
        message: "Successfully logged in!",
        redirectUrl: `${process.env.FRONTEND_LINK}/`,
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
