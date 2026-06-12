const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
