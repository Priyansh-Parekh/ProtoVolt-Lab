import generateToken from "../../utils/tokenGenerator.js";
import User from '../../models/users.js'

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    let token = generateToken(email);
    const user = await User.findOne({ email });
    try {
        if (user && user.verified && (await user.matchPassword(password))) {
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,     // true in production
                // sameSite: "strict"
            });
            res.status(200).json({success:true,message:"succesfully credentials match", redirectUrl: 'http://localhost:5173/dashboard' });
        }else{
            if(!user.verified)
            res.json({success:false,message:"No User Exist"});

            res.json({success:false,message:"Invalid Credentials"});
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export default userLogin