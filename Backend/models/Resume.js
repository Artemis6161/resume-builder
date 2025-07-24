const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
     required: true },
  title: String,
  profession: String,
  summary: String,
  email: String,
  phone: String,
  linkedin: String,
  github: String,
  portfolio: String,
   location: String,
  education: [
    {
      degree: String,
      institution: String,
      from: String,
      to: String,
      currentlyStudying: Boolean
    }
  ],
  skills: [String],
  experience: [
    {
      company: String,
      role: String,
      from: String,
      to: String,
      currentlyWorking: Boolean,
      summary: String
    }
  ],
  projects: [
    {
      title: String,
      link: String,
      description: String,
      from: String,
      to: String,
      technology: String
    }
  ],
  certifications: [String],
  languages: [String],
  aiSuggestions: {
    experience: [String],
    projects: [String]
  },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
