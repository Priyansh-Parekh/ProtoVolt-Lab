import { Router } from "express";
import getUserDetails from "../controllers/user/getUserDetails.js";
import getClassrooms from "../controllers/user/getClassroomDetails.js";
import loginMiddelware from "../middleware/login.js";

const route = Router();

route.get("/getUser", loginMiddelware, getUserDetails);
route.get("/getClassrooms", loginMiddelware, getClassrooms);

export default route;