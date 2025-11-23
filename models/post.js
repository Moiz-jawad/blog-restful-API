const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: String,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    file: { type: mongoose.Types.ObjectId, ref: "File" },
    updateBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
