// 1. Load environment variables FIRST. This is the crucial fix.
import 'dotenv/config';

import express, { json, urlencoded } from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import connectDB from './server/config/db.js';
const port = process.env.PORT || 3000;

connectDB();
// --- MIDDLEWARE ---
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// import route files
import mainRouter from './server/routes/main.js';
import auth from './server/routes/auth.js';

//Routes
app.use('/', mainRouter);
app.use('/user/auth/',auth);


// --- SERVER LISTENER ---
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});