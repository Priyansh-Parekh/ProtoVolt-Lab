import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
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
        default: null,
    },
    bio: {
        type: String,
    },
    verified:{
        type:Boolean,
        default:false
    },
    otp: { 
        type: String 
    },
    otpExpiresAt: {
        type: Date
    } // expiration time
});

// Hashing 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password);
}


const User = mongoose.model('User', userSchema, 'Users');

export default User;