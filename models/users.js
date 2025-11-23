const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    // role - 1 super admin > role - 2 normal admin > role - 3 normal user
    role: { type: Number, default: 3 },
    verificationCode: { type: String },
    codeSentAt: { type: Date },
    forgotPasswordCode: { type: String },
    isVerified: { type: Boolean, default: false },
    profilePic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
