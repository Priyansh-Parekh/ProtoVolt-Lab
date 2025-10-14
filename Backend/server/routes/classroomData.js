import { Router } from "express";
import asyncHandler from "express-async-handler";
import createClassroom from "../controllers/classroom/createClassroom.js";
import getAssignment from "../controllers/classroom/createClassroom.js";
import getAnnouncement from "../controllers/classroom/createClassroom.js";


// middelwares
import { uploadClassroomImage } from "../middleware/multer.js";
import loginMiddelware from "../middleware/login.js";

const route = Router();

route.use(loginMiddelware);

route.post("/createClassroom", uploadClassroomImage.single('image'), createClassroom);
route.get("/:assignmentId", asyncHandler(getAssignment));
route.get("/:announcementId", asyncHandler(getAnnouncement));


export default route;