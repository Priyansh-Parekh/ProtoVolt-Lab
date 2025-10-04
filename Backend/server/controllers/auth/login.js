import express from "express";
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (optional, for forms)

import generateToken from "../../utils/tokenGenerator.js";
import User from '../../models/users.js'

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    let token = generateToken(email);
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,     // true in production
            sameSite: "strict"
          });
        res.redirect('http://localhost:5173/dashboard');
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
};

export default userLogin