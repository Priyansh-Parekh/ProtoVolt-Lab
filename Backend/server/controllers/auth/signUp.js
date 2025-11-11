import User from '../../models/users.js'


const userSignUp = async (req, res) => {
    const { name, email, password, role } = req.body;
  
    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }
  
    const userExists = await User.findOne({ email });
    if (userExists) {
      if(userExists.verified){
      res.status(400);
      throw new Error('User with this email already exists');
      }
    }

    if(userExists){
      await userExists.deleteOne();
    }
  
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
  
   
    if (user) {
      res.redirect(`${process.env.BACKEND_LINK}/user/auth/otpGen?type=signUp&email=${email}`);
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
}
  
export default userSignUp;
