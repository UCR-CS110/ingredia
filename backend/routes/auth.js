const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { email, password, name, username, phone } = req.body;
  try {
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res
        .status(400)
        .json({ error: "Email or username already in use" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      name,
      username,
      phone,
      role: "explorer",
    });
    res.json({
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "No account found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });
    res.json({
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/profile", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      email: user.email,
      name: user.name,
      username: user.username,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/profile", async (req, res) => {
  const { email, name, username, phone } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, username, phone },
      { new: true },
    );
    res.json({
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/reset-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "No account found" });
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ error: "Current password is incorrect" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

router.put("/request-expert", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email, role: "explorer" },
      { role: "expert" },
      { new: true },
    );
    if (!user)
      return res
        .status(400)
        .json({ error: "User not found or already upgraded" });
    res.json({ email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
