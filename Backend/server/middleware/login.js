import jwt from "jsonwebtoken";


const loginMiddelware = async (req , res , next)=>{

    try {
        const token = req.cookies.token;
        if (!token || token === undefined) {
            req.user = undefined;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try to find the user in each collection
        let user = await viewers.findOne({ email: decoded.email });
        if (user) {
            req.user = user;
            return next();
        }

        user = await clubs.findOne({ email: decoded.email });
        if (user) {
            req.user = user;
            return next();
        }
        
        // If not found in any collection
        req.user = undefined;
    } catch (err) {
        console.error("Authentication error:", err);
        req.user = undefined;
    }

    next();
}

export default loginMiddelware