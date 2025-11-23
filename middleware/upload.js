const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
    files: 1, // Limit to 1 file
  },
  fileFilter: (req, file, cb) => {
    // Additional security: validate file type
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only JPEG and PNG images are allowed."),
        false
      );
    }
  },
});

module.exports = upload;
