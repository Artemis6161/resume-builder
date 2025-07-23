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
    console.log("Fetching resume ID:", req.params.id);
    console.log("For user:", req.user.id);

    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });

    if (!resume) {
      console.log("Resume not found.");
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json(resume);
  } catch (err) {
    console.error("Error fetching resume:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Merge and save
    Object.assign(resume, updatedData);
    const updatedResume = await resume.save();

    res.json(updatedResume);
  } catch (error) {
    console.error('Error updating resume:', error.message);
    res.status(500).json({ message: 'Server error while updating resume' });
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



