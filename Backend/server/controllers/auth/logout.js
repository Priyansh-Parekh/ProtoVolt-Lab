const logout = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.Cookie_Secure==="true",
        sameSite: "none",
      });
  
      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error during logout",
      });
    }
  };
  
  export default logout;
  