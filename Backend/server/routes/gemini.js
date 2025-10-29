import { Router } from "express";
import test from "../controllers/geminiService/test.js";




const route = Router();

//create api's
route.get("/test", test);



export default route;