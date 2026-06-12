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
    });
    res.json({ email: user.email, name: user.name, username: user.username });
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

    res.json({ email: user.email, name: user.name, username: user.username });
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
    res.json({ email: user.email, name: user.name, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
