const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");

const {
  signupValidator,
  loginValidator,
  emailValidator,
  userVerfiyValidator,
  recoverPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
} = require("../validator/auth");

const { validate } = require("../validator/validate");
const isAuth = require("../middleware/isAuth");

router.post("/signup", signupValidator, validate, authController.signup);

router.post("/login", loginValidator, validate, authController.login);

router.post(
  "/sent-verification",
  emailValidator,
  validate,
  authController.verifyCode
);

router.post(
  "/verify-user",
  userVerfiyValidator,
  validate,
  authController.verifyUser
);

router.post(
  "/forgot-password-code",
  emailValidator,
  validate,
  authController.forgotPasswordCode
);

router.post(
  "/recover-password",
  recoverPasswordValidator,
  validate,
  authController.recoverPassword
);

router.put(
  "/change-password",
  changePasswordValidator,
  validate,
  isAuth,
  authController.changePassword
);

router.put(
  "/update-profile",
  isAuth,
  updateProfileValidator,
  validate,
  authController.updateProfile
);

router.get("/current-user", isAuth, authController.currentUser);

module.exports = router;
