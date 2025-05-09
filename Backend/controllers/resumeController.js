const Resume = require("../models/Resume");

exports.createResume = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Authenticated User:', req.user);

    const {
     
      title, 
      profession,
      email,
      phone,
      summary,
      education,
      experience,
      skills,
    } = req.body;

    if ( !title || !profession ) {
      return res.status(400).json({ msg: 'Missing name or profession' });
    }

    const newResume = new Resume({
      
      title,
      profession,
      email,
      phone,
      summary,
      education,
      experience,
      skills,
      user: req.user.id,
    });

    const savedResume = await newResume.save();
    console.log('Saved Resume:', savedResume);

    res.status(201).json(savedResume);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ resumes });
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
exports.getSingleResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    console.log('Saved resume:', resume);
    if (!resume || resume.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resume", error });
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
