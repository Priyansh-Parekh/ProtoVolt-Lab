import express from "express";
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (optional, for forms)

import User from '../../models/users.js'