const { check, param } = require("express-validator");
const mongoose = require("mongoose");

const addPostValidator = [
  check("title").notEmpty().withMessage("Title is required"),

  check("file")
    .notEmpty()
    .withMessage("File is required")
    .bail()
    .custom((file) => {
      if (!mongoose.Types.ObjectId.isValid(file)) {
        throw new Error("File must be a valid ObjectId");
      }
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .bail()
    .custom((category) => {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw new Error("Category must be a valid ObjectId");
      }
      return true;
    }),
];

const updatePostValidator = [
  check("file")
    .notEmpty()
    .withMessage("File is required")
    .bail()
    .custom((file) => {
      if (!mongoose.Types.ObjectId.isValid(file)) {
        throw new Error("File must be a valid ObjectId");
      }
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .bail()
    .custom((category) => {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw new Error("Category must be a valid ObjectId");
      }
      return true;
    }),
];

const isValidator = [
  param("id")
    .bail()
    .custom((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("invalid id");
      }
      return true;
    }),
];

module.exports = { addPostValidator, updatePostValidator, isValidator };
