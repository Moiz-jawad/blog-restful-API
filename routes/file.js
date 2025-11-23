const express = require("express");
const router = express.Router();
const { fileController } = require("../controllers");
const isAuth = require("../middleware/isAuth");
const upload = require("../middleware/upload");

router.post(
  "/upload",
  isAuth,
  upload.single("image"),
  fileController.uploadFile
);

router.get("/signed-url", isAuth, fileController.getSignedUrl);

router.delete("/delete-file", isAuth, fileController.deleteFile);

module.exports = router;
