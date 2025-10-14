import {v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.comfig({
    cloud_name : "ProtoVolt",
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret
})


const uploadCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return { success:false ,message:"No file Tracked"};

        const res = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        });
        return res;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return { success:false ,message:"Something happen Reupload Your File"};
    }
}

export default uploadCloudinary;    