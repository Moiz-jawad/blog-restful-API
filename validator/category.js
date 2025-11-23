const { check, param } = require("express-validator");
const mongoose = require("mongoose");

const addCategoryValidator = [
  check("title").notEmpty().withMessage("title is required"),
];

const isValidate = [
  param("id").custom(async (id) => {
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category id");
    }
  }),
];

module.exports = { addCategoryValidator, isValidate };
