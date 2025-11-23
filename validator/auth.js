const { check } = require("express-validator");
const validateEmail = require("../validator/validateEmail");
const mongoose = require("mongoose");

const signupValidator = [
  check("name").notEmpty().withMessage("name is required"),
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("email is required"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .notEmpty()
    .withMessage("password is required"),
];

const loginValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("email is required"),
  check("password").notEmpty().withMessage("password is required"),
];

const emailValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("email required"),
];

const userVerfiyValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("email required"),
  check("code").notEmpty().withMessage("code is required"),
];

const recoverPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("email is required"),
  check("code").notEmpty().withMessage("code is required"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .notEmpty()
    .withMessage("password is required"),
];

const changePasswordValidator = [
  check("oldPassword").notEmpty().withMessage("old password is required"),
  check("newPassword")
    .isLength({ min: 8 })
    .withMessage("new password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "new password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .notEmpty()
    .withMessage("new password is required"),
];

const updateProfileValidator = [
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
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
