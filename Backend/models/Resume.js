const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  title: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  email: String,
  phone: String,
  summary: String,
  education: [Object], // or a proper schema if needed
  experience: [Object],
  skills: [String],
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
