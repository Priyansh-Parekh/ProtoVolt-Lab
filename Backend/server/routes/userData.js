import { Router } from "express";

// 
import getUserDetails from "../controllers/user/getUserDetails.js";

//
import loginMiddelware from "../middleware/login.js";

const route = Router();

route.get("/getUser", loginMiddelware, getUserDetails);

export default route;