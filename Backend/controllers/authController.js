const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const newUser = new User({ name, email, password }); // No manual hashing
    await newUser.save(); // This triggers the pre-save hook

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login attempt with:", email, password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔐 Hashed password in DB:", user.password);

    const match = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match result:", match);

    if (!match) {
      console.log("❌ Password does not match");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log("🔥 Error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

