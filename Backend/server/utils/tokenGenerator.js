import jwt from "jsonwebtoken";

// A helper function to generate a token
const generateToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '30d', 
    });
  };

export default generateToken
  