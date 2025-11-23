const multer = require("multer");
const path = require("path");
const generateCode = require("../utils/generateCode");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, callback) => {
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const filename = originalName.replace(extension, "");
    const compressedFilename = filename.split(" ").join("_");
    const lowercaseFilename = compressedFilename.toLowerCase();
    const code = generateCode(12);
    const finalFile = `${lowercaseFilename}_${code}${extension}`;

    callback(null, finalFile);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const mimefile = file.mimetype;
    if (
      mimefile === "image/jpg" ||
      mimefile === "image/jpeg" ||
      mimefile === "image/png" ||
      mimefile === "application/pdf"
    ) {
      callback(null, true);
    } else {
      callback(new Error("file type not support"), false);
    }
  },
});

module.exports = upload;
