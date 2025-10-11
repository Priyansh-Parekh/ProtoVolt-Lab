import jwt from "jsonwebtoken";
import User from "../models/users.js";

const loginMiddelware = async (req , res , next)=>{

    try {
        const token = req.cookies.token;
        if (!token || token === undefined) {
            // console.log("I am here!")
            req.user = undefined;
            next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try to find the user in each collection
        let user = await User.findOne({ email: decoded.email});
        if (user) {
            req.user = user;
         next();
        }
        // console.log(decoded);
        // If not found in any collection
        req.user = undefined;
    } catch (err) {
        console.error("Authentication error:", err);
        req.user = undefined;
    }

    next();
}

export default loginMiddelware;