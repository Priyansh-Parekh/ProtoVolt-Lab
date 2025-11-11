import { Router } from "express";
const route = Router();

//importing controllerssssss
import otpGen from "../controllers/auth/otpgen.js"
import userSignUp from "../controllers/auth/signUp.js";
import userLogin from "../controllers/auth/login.js";
import otpVer from "../controllers/auth/otpVer.js";
import userForgotPass from "../controllers/auth/forgotPass.js";
import userPassChange from "../controllers/auth/userPassChange.js";
import logout from "../controllers/auth/logout.js";

//importing middelwaresssss
import loginMiddelware from "../middleware/login.js";

//otp Generator and Email sender
route.get('/otpGen',otpGen);

//otp Verification
route.post('/otpVer',otpVer)

//signUp route
route.post('/signup', userSignUp);

//login route
route.post('/login', userLogin);

//forgot password
route.post('/forgotPass',userForgotPass);

//password change
route.post('/changePass',userPassChange)

//Logout
route.get('/logout',logout)

export default route;