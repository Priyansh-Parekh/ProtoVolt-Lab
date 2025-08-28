// 1. Load environment variables FIRST. This is the crucial fix.
require('dotenv').config();

import express, { json, urlencoded } from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import { connect } from 'mongoose';
const port = process.env.PORT || 3000;

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    const connString = process.env.URI;
    if (!connString) {
        console.error('❌ URI not found in .env file. Please add it.');
        process.exit(1);
    }
    await connect(connString);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};
connectDB();

// --- MIDDLEWARE ---
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// --- ROUTES ---
app.use('/', require('./server/routes/main'));


// --- SERVER LISTENER ---
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});