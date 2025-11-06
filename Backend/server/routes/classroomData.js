import { Router } from "express";
import createClassroom from "../controllers/classroom/createClassroom.js";
import getAssignment  from "../controllers/classroom/getAssignment.js";
import getClassroomPeople from "../controllers/classroom/profNstud.js";
import GetClassroom from "../controllers/classroom/getClassroom.js";
import createAssignment from "../controllers/classroom/createAssignment.js";
import createAnnouncement from "../controllers/classroom/createAnnouncement.js";


// middelwares
import { uploadAssignmentFiles, uploadClassroomImage } from "../middleware/multer.js";
import loginMiddelware from "../middleware/login.js";

const route = Router();

route.use(loginMiddelware);

//create api's
route.post("/createClassroom", uploadClassroomImage.single('image'), createClassroom);
route.post("/createAssignment",uploadAssignmentFiles.single('file'),createAssignment);
route.post("/createAnnouncement",uploadAssignmentFiles.single('file'), createAnnouncement);

//data api's
route.get("/getClassroom",GetClassroom);
route.get("/getAssignment", getAssignment);
route.get("/:classroomId/people", getClassroomPeople);


export default route;