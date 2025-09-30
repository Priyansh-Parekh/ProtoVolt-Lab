import { Router } from "express";
const route = Router();

import otpGen from "../controllers/auth/otpgen.js"


//otp Generator and Email sender
route.get('/otpGen',otpGen)

export default route;