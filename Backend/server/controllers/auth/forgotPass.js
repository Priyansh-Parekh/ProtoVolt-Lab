const userForgotPass = async(req,res)=>{
    try {
       const {email} = req.query;
       if(email){
            res.redirect(`/user/auth/otpGen?type=forgotPass&email=${email}`)
       }else{
            res.redirect('http://localhost:5173/user/login')
       }
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export default userForgotPass;