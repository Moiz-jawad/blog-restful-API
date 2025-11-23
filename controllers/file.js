const path = require("path");
const mongoose = require("mongoose");
const { validateExtension } = require("../validator/file");
const {
  uploadFileToS3,
  signedUrl,
  deleteFileFromS3,
} = require("../utils/awsS3");
const { File } = require("../models");

const uploadFile = async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "File is not selected",
      });
    }

    const ext = path.extname(file.originalname); // ".jpg"
    const isValidateExt = validateExtension(ext); // pass ext here

    if (!isValidateExt) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Only jpg, jpeg & png format is allowed",
      });
    }

    const key = await uploadFileToS3({ file, ext });

    if (key) {
      const newFile = new File({
        key,
        size: file.size,
        mimetype: file.mimetype,
        createdBy: req.user._id,
      });
      await newFile.save();
    }

    return res.status(201).json({
      code: 201,
      status: true,
      message: "File uploaded successfully",
      data: { key },
    });
  } catch (error) {
    next(error);
  }
};

const getSignedUrl = async (req, res, next) => {
  try {
    const { key } = req.query;

    if (!key || typeof key !== "string" || !key.trim()) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Missing or invalid query parameter: key",
      });
    }

    // Sanitize key to prevent path traversal
    const sanitizedKey = key.trim();
    if (sanitizedKey.includes("..") || sanitizedKey.includes("/")) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Invalid key format",
      });
    }

    const url = await signedUrl(sanitizedKey);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Signed URL generated successfully",
      data: { url },
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { key } = req.query;

    if (!key || typeof key !== "string" || !key.trim()) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Missing or invalid query parameter: key",
      });
    }

    // Sanitize key to prevent path traversal
    const sanitizedKey = key.trim();
    if (sanitizedKey.includes("..") || sanitizedKey.includes("/")) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Invalid key format",
      });
    }

    await deleteFileFromS3(sanitizedKey);

    const file = await File.findOneAndDelete({ key: sanitizedKey });
    if (!file) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "File not found",
      });
    }
    return res.status(200).json({
      code: 200,
      status: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile, getSignedUrl, deleteFile };
