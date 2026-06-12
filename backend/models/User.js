const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["explorer", "expert", "admin"],
      default: "explorer",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
