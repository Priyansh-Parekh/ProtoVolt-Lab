import { Router } from "express";
const route = Router();

import otpGen from "../controllers/auth/otpgen.js"
import userSignUp from "../controllers/auth/signUp.js";
import userLogin from "../controllers/auth/login.js";
import otpVer from "../controllers/auth/otpVer.js";

//otp Generator and Email sender
route.get('/otpGen',otpGen);

//otp Verification
route.post('/otpVer',otpVer)

//signUp route
route.post('/signup', userSignUp);

//login route
route.post('/login', userLogin);


export default route;