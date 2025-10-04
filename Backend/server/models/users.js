import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'professor', 'admin'],
        required: true,
    },
    profilePicture: {
        type: String,
        // here default cloudinary url will be provided
        default: null,
    },
    bio: {
        type: String,
    },
    otp: { 
        type: String 
    },
    otpExpiresAt: {
        type: Date
    } // expiration time
});

const User = mongoose.model('User', userSchema, 'Users');

export default User;