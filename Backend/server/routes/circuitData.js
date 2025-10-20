import { Router } from "express";

// importing controlleres
import getCircuit from "../controllers/circuit/getCircuit.js";
import createCircuit from "../controllers/circuit/createCircuit.js";
import updateCircuit from "../controllers/circuit/updateCircuit.js";


//importing middlewares
import loginMiddelware from "../middleware/login.js";

const route = Router();
route.use(loginMiddelware);

route.get('/getCircuit',getCircuit)

route.post('/createCircuit',createCircuit);

route.post('/updateCircuit',updateCircuit);





export default route;
