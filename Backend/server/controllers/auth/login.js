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
            res.status(200).json({ redirectUrl: 'http://localhost:5173/dashboard' });
        }else{
            res.json({status:401,message:"Invalid Credentials"});
        }
    } catch (err) {
        res.status(401).message(err.message);
    }
};

export default userLogin