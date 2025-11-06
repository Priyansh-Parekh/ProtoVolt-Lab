import multer from "multer";
import path from "path";

// 🧍‍♂️ Avatar Upload
const storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./server/public/avatars"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s/g, "-");
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

const uploadAvatar = multer({ storage: storageAvatar });

// 🏫 Classroom Image Upload
const storageClassroom = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./server/public/classroomImages"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s/g, "-");
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

const uploadClassroomImage = multer({ storage: storageClassroom });

// 📚 Assignment File Upload (PDFs, Docs, etc.)
const storageAssignment = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./server/public/assignmentFiles"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // ✅ keep extension (.pdf, .docx, etc.)
    const base = path.basename(file.originalname, ext).replace(/\s/g, "-"); // remove spaces
    cb(null, `${base}-${uniqueSuffix}${ext}`); // ✅ preserve extension
  },
});

const uploadAssignmentFiles = multer({ storage: storageAssignment });

// 🚀 Export all uploaders
export { uploadAssignmentFiles, uploadAvatar, uploadClassroomImage };
