import multer from "multer";
import path from "path";
import fs from "fs";

// Create the 'uploads' folder if it doesn't exist
const uploadFolder = "uploads";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

export default upload;
