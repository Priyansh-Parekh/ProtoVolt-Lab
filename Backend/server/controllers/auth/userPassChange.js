import User from "../../models/users.js";

const userPassChange = async (req,res)=>{
    try {
        const{newPassword}=req.body;
        const{email}=req.query;
        const user = await User.findOne({email});
        if(user){
            user.password = newPassword;
            user.save();
            res.status(200).json({success: true,message:"Password changed",redirectUrl:"http://localhost:5173/user/login"});
        }else{
            res.status(400).json({success:false,message:"Client Error"});
        }
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

export default userPassChange;