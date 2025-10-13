import {Router} from "express";
import asyncHandler from "express-async-handler";
import { createClassroom, getAssignment, getAnnouncement } from "../controllers/classroomController.js";
import loginMiddelware from "../middleware/login.js";

const route = Router();

route.use(loginMiddelware);

route.post("/",asyncHandler(createClassroom));
route.get("/:assignmentId",asyncHandler(getAssignment));
route.get("/:announcementId",asyncHandler(getAnnouncement));

export default route;