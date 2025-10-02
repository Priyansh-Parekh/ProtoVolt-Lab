import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';

const generateToken =(id) => {
  return jwt.sign({id}, process.env.JWT_SECRET , {
    expiresIn: '30d',
  });
};

const registerUser = asyncHandler(async, (req,res))