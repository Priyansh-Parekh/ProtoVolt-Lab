import {v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


 cloudinary.config({
    cloud_name : process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret
})


const uploadClassroomImageCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return { success:false ,message:"No file Tracked"};

        const res = await cloudinary.uploader.upload(localFilePath,{
            folder: "classroomImages",
            resource_type:'auto'
        });
        console.log(res);
        if(fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return res;
    } catch (error) {
        if(fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return { success:false ,message:"Something happen Reupload Your File"};
    }
}


const uploadAvatarCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return { success:false ,message:"No file Tracked"};

        const res = await cloudinary.uploader.upload(localFilePath,{
            folder: "avatar",
            resource_type:'auto'
        });
        console.log(res);
        if(fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return res;
    } catch (error) {
        if(fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return { success:false ,message:"Something happen Reupload Your File"};
    }
}


const uploadAssignmentFilesCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return { success:false ,message:"No file Tracked"};

        const res = await cloudinary.uploader.upload(localFilePath,{
            folder: "assignmentFiles",
            resource_type:'auto'
        });
        console.log(res);
        if(fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return res;
    } catch (error) {
        if(fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return { success:false ,message:"Something happen Reupload Your File"};
    }
}

export {uploadAssignmentFilesCloudinary,uploadAvatarCloudinary,uploadClassroomImageCloudinary}