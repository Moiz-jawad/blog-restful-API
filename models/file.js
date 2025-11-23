const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    key: { type: String, required: true },
    size: Number,
    mimetype: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
