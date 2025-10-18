import { Router } from "express";
import asyncHandler from "express-async-handler";
import createClassroom from "../controllers/classroom/createClassroom.js";
import getAssignment from "../controllers/classroom/createClassroom.js";
// import getAnnouncement from "../controllers/classroom/createClassroom.js";
import getClassroomPeople from "../controllers/classroom/profNstud.js";
import GetClassroom from "../controllers/classroom/getClassroom.js";


// middelwares
import { uploadClassroomImage } from "../middleware/multer.js";
import loginMiddelware from "../middleware/login.js";

const route = Router();

route.use(loginMiddelware);

//create api's
route.post("/createClassroom", uploadClassroomImage.single('image'), createClassroom);

//data api's
route.get("/getClassroom",GetClassroom);
route.get("/:assignmentId", asyncHandler(getAssignment));
// route.get("/:announcementId", asyncHandler(getAnnouncement));
route.get("/:classroomId/people", getClassroomPeople);


export default route;