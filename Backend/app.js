// 1. Load environment variables FIRST. This is the crucial fix.
import 'dotenv/config';

import express, { json, urlencoded } from 'express';
import cors from "cors";

const app = express();
import cookieParser from 'cookie-parser';
import connectDB from './server/config/db.js';
const port = process.env.PORT || 3000;

connectDB();
// --- MIDDLEWARE ---

const allowedOrigins = [
  "http://localhost:5173",       // for local dev
  "https://protovolt-lab.vercel.app" // for deployed frontend
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // important for cookies / JWT
  })
);

// import route files
import mainRouter from './server/routes/main.js';
import auth from './server/routes/auth.js';
import userRouter from './server/routes/userData.js';
import classRouter from './server/routes/classroomData.js';
import circuitRoutes from './server/routes/circuitData.js';
import geminiService from './server/routes/gemini.js';


//Routes
app.use('/', mainRouter);
app.use('/user/auth/',auth);
app.use('/user/data', userRouter); 
app.use('/classroom/data',classRouter);
app.use('/circuit/data',circuitRoutes)
app.use("/gemini/service",geminiService);

// --- SERVER LISTENER ---
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});