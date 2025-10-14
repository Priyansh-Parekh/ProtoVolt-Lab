import multer from 'multer';

const storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './temp/avatars'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const uploadAvatar = multer({ storage: storageAvatar });

const storageClassroom = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './temp/classrooms'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });
  
const uploadClassroomImage = multer({ storage: storageClassroom });
  
const storageAssignment = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './temp/assignments'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.originalname.replace(/\s/g, '-') + '-' + uniqueSuffix);
    }
  });
  
const uploadAssignment = multer({ storage: storageAssignment });
  
export {uploadAssignment,uploadAvatar,uploadClassroomImage};