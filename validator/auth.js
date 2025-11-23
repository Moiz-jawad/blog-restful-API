const { check } = require("express-validator");
const validateEmail = require("../validator/validateEmail");
const mongoose = require("mongoose");

const signupValidator = [
  check("name").notEmpty().withMessage("name is required"),
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password must be 6 char long")
    .notEmpty()
    .withMessage("password is required"),
];

const loginValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
  check("password").notEmpty().withMessage("password is required"),
];

const emailValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email required"),
];

const userVerfiyValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email required"),
  check("code").notEmpty().withMessage("code is required"),
];

const recoverPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
  check("code").notEmpty().withMessage("code is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password must be 6 char long")
    .notEmpty()
    .withMessage("password is required"),
];

const changePasswordValidator = [
  check("oldPassword").notEmpty().withMessage("old password is required"),
  check("newPassword").notEmpty().withMessage("new password is required"),
];

const updateProfileValidator = [
  check("email")
    .optional()
    .custom(async (email) => {
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }
      return true;
    }),
  check("profilePic")
    .optional()
    .custom(async (profilePic) => {
      if (profilePic && !mongoose.Types.ObjectId.isValid(profilePic)) {
        throw new Error("Invalid profile picture ID");
      }
      return true;
    }),
];

module.exports = {
  signupValidator,
  loginValidator,
  emailValidator,
  userVerfiyValidator,
  recoverPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
};
