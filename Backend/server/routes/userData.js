import { Router } from "express";
import getUserDetails from "../controllers/user/getUserDetails.js";
import getClassrooms from "../controllers/user/getClassroomDetails.js";
import loginMiddelware from "../middleware/login.js";

const route = Router();

route.get("/getUser", loginMiddelware, getUserDetails);
route.get("/myclassrooms", loginMiddelware, getClassrooms);

export default route;