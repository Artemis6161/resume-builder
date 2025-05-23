const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: String,
  enhancedResume: {
    type: String,
    default: '',
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // ⬅️ Prevents double hashing
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
