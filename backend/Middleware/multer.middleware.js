import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDirectory = path.resolve("public/temp");

const ensureUploadDirectory = () => {
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    ensureUploadDirectory();
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

const upload = multer({ storage });

export default upload;
