const { User, File } = require("../models");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/genrateToken");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Normalize email
    const normalizedEmail = email?.trim().toLowerCase();

    const isEmailExist = await User.findOne({ email: normalizedEmail });
    if (isEmailExist) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Email already exists",
      });
    }

    const hashPasswording = await hashPassword(password);

    const user = new User({
      name,
      email: normalizedEmail,
      password: hashPasswording,
      role,
    });

    await user.save();
    return res.status(201).json({
      code: 201,
      status: true,
      message: "User successfully created",
      data: { id: user._id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Normalize email
    const normalizedEmail = email?.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        code: 401,
        status: false,
        message: "Invalid credentials",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({
        code: 401,
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      code: "200",
      status: true,
      message: "User login successfully",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

const verifyCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Email is required",
      });
    }

    // Normalize email
    const normalizedEmail = email?.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "User already verified",
      });
    }

    // Prevent spamming: allow new code only every 60 seconds
    const now = new Date();
    const lastSent = user.codeSentAt ? new Date(user.codeSentAt) : null;
    if (lastSent && now - lastSent < 60 * 1000) {
      return res.status(429).json({
        code: 429,
        status: false,
        message: "Please wait before requesting another verification code",
      });
    }

    const code = generateCode(6);
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes expiration
    user.verificationCode = code;
    user.codeSentAt = now;
    user.codeExpiresAt = expiresAt;
    await user.save();

    await sendEmail(
      user.email,
      "Email Verification Code",
      code,
      "verify your account"
    );

    res.status(200).json({
      code: 200,
      status: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    // Normalize email
    const normalizedEmail = email?.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "User not found!",
      });
    }

    // Check if code has expired
    if (user.codeExpiresAt && new Date() > new Date(user.codeExpiresAt)) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Verification code has expired",
      });
    }

    if (
      !user.verificationCode ||
      String(user.verificationCode).trim() !== String(code).trim()
    ) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Invalid code",
      });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.codeExpiresAt = null;
    await user.save();

    return res.status(200).json({
      code: 200,
      status: true,
      message: "User verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPasswordCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Normalize email
    const normalizedEmail = email?.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Don't reveal if user exists (security best practice)
      return res.status(200).json({
        code: 200,
        status: true,
        message: "If the email exists, a password reset code has been sent",
      });
    }

    // Prevent spamming: allow new code only every 60 seconds
    const now = new Date();
    const lastSent = user.codeSentAt ? new Date(user.codeSentAt) : null;
    if (lastSent && now - lastSent < 60 * 1000) {
      return res.status(429).json({
        code: 429,
        status: false,
        message: "Please wait before requesting another password reset code",
      });
    }

    const code = generateCode(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration
    user.forgotPasswordCode = code;
    user.forgotPasswordCodeExpiresAt = expiresAt;
    user.codeSentAt = now;
    await user.save();

    await sendEmail(
      user.email,
      "forgot password code",
      code,
      "Change your password"
    );

    res.status(200).json({
      code: 200,
      status: true,
      message: "forgot password code sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const recoverPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;
    // Normalize email
    const normalizedEmail = email?.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "User not found",
      });
    }

    // Check if code has expired
    if (
      user.forgotPasswordCodeExpiresAt &&
      new Date() > new Date(user.forgotPasswordCodeExpiresAt)
    ) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Password reset code has expired",
      });
    }

    if (
      !user.forgotPasswordCode ||
      String(user.forgotPasswordCode).trim() !== String(code).trim()
    ) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Invalid code",
      });
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.forgotPasswordCode = null;
    user.forgotPasswordCodeExpiresAt = null;

    await user.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "password recover successfully",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "User not found",
      });
    }
    const match = await comparePassword(oldPassword, user.password);

    if (!match) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Old password not matched",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "New password must be different from old password",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, email, profilePic } = req.body;

    const user = await User.findById(_id).select(
      "-password -verificationCode -forgotPasswordCode"
    );
    if (!user) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "User not found",
      });
    }

    if (email) {
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      const isEmailExist = await User.findOne({ email: normalizedEmail });
      if (isEmailExist && !user._id.equals(isEmailExist._id)) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Email already exist!",
        });
      }
      user.email = normalizedEmail;
    }

    if (profilePic) {
      // Validate ObjectId format
      const mongoose = require("mongoose");
      if (!mongoose.Types.ObjectId.isValid(profilePic)) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Invalid profile picture ID format",
        });
      }
      const file = await File.findById(profilePic);
      if (!file) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "File not found",
        });
      }
      user.profilePic = profilePic;
    }

    user.name = name ? name.trim() : user.name;

    if (email) {
      user.isVerified = false;
    }

    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "update profile successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id)
      .select("-password -verificationCode -forgotPasswordCode")
      .populate("profilePic");
    if (!user) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "user not found!",
      });
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "get current user successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  signup,
  login,
  verifyCode,
  verifyUser,
  forgotPasswordCode,
  recoverPassword,
  changePassword,
  updateProfile,
  currentUser,
};
