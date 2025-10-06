import multer from "multer";
import path from "path";
import fs from "fs";

const tempDir = "./public/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp" , ".jfif"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpg, jpeg, png, webp, jfif, .gif, .bmp) are allowed"), false);
    }
  },
});

export default upload;
