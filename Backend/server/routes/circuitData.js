import { Router } from "express";

// importing controlleres
import getCircuit from "../controllers/circuit/getCircuit.js";
import createCircuit from "../controllers/circuit/createCircuit.js";
import updateCircuit from "../controllers/circuit/updateCircuit.js";
import deleteCircuit from "../controllers/circuit/deleteCircuit.js";
import attachToSubtab from "../controllers/circuit/attachToSubtab.js";

//importing middlewares
import loginMiddelware from "../middleware/login.js";

const route = Router();
route.use(loginMiddelware);

route.get('/getCircuit',getCircuit)

route.post('/createCircuit',createCircuit);

route.post('/updateCircuit',updateCircuit);

route.post('/deleteCircuit',deleteCircuit);
route.post("/attachToSubtab", attachToSubtab);



export default route;
