import { Router } from "express";
import solve from "../controllers/geminiService/solve.js";




const route = Router();

//create api's
route.post("/solveCircuit", solve);



export default route;