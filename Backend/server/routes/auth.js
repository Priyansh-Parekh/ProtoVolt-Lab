import { Router } from "express";
const route = Router();

import otpGen from "../controllers/auth/otpgen.js"
import userSignUp from "../controllers/auth/signUp.js";


//otp Generator and Email sender
route.get('/otpGen',otpGen)

//signUp route
route.get('/signup', userSignUp);

//login route
// route.get('/login', userLogin);


export default route;