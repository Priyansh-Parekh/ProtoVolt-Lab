import { Router } from "express";

//importing controllers
import getUserDetails from "../controllers/user/getUserDetails.js";
import getClassrooms from "../controllers/user/getClassroomDetails.js";
import loginMiddelware from "../middleware/login.js";
import getCircuits from "../controllers/user/getCircuits.js";
import getClassAssStudData from "../controllers/user/getClassAssStudData.js"

const route = Router();

route.get("/getUser", loginMiddelware, getUserDetails);
route.get("/getClassrooms", loginMiddelware, getClassrooms);
route.get("/getCircuits", loginMiddelware, getCircuits);
route.get("/getClassAssStudData",loginMiddelware,getClassAssStudData);

export default route;