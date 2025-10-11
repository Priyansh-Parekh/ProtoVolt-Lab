// 1. Load environment variables FIRST. This is the crucial fix.
import 'dotenv/config';

import express, { json, urlencoded } from 'express';
import cors from "cors";

const app = express();
app.use(express.json());
import cookieParser from 'cookie-parser';
import connectDB from './server/config/db.js';
const port = process.env.PORT || 3000;

connectDB();
// --- MIDDLEWARE ---
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json()); // This allows the app to accept JSON
app.use(cors({                                    // Allow frontend origin and credentials
  origin: "http://localhost:5173", // frontend URL
  credentials: true,               // allow cookies / Authorization headers
}));

// import route files
import mainRouter from './server/routes/main.js';
import auth from './server/routes/auth.js';
import userRouter from './server/routes/userData.js';


//Routes
app.use('/', mainRouter);
app.use('/user/auth/',auth);
app.use('/user/data', userRouter); 

// --- SERVER LISTENER ---
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});