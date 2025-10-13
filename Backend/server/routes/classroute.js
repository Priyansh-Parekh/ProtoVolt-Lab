import {Router} from "express";
import asyncHandler from "express-async-handler";
import { getAllClassrooms, accessClassroom, createClassroom, getAssignment, getAnnouncement } from "../controllers/classroomController";
import loginMiddelware from "../middleware/login";

const route = Router();

route.use(loginMiddelware);

route.post("/",asyncHandler(createClassroom));
route.get("/:assignmentId",asyncHandler(getAssignment));
route.get("/:announcementId",asyncHandler(getAnnouncement));

export default route;