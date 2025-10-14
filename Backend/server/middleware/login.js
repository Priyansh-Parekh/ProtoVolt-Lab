import jwt from "jsonwebtoken";
import User from "../models/users.js";

const loginMiddelware = async (req, res, next) => {

    try {
        const token = req.cookies.token;
        if (!token || token === undefined) {
            // console.log("I am here!")
            req.user = undefined;
            return next();
        }
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Try to find the user in each collection
            let user = await User.findOne({ email: decoded.email });
            if (user) {
                req.user = user;
                return next();
            }
            // console.log(decoded);
        }


        // If not found in any collection
        req.user = undefined;
        return next();
    } catch (err) {
        console.error("Authentication error:", err);
        req.user = undefined;
        return next();
    }
}

export default loginMiddelware;