const Resume = require("../models/Resume");

exports.createResume = async (req, res) => {
  try {
    const newResume = new Resume({
      ...req.body,
      user: req.user.id,
    });

    const savedResume = await newResume.save();
    res.status(201).json(savedResume);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });

    if (!resume) return res.status(404).json({ msg: "Resume not found" });

    res.json(resume);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedResume) return res.status(404).json({ msg: "Resume not found" });

    res.json(updatedResume);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!deleted) return res.status(404).json({ msg: "Resume not found" });

    res.json({ msg: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
