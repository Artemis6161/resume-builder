const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  getSingleResume,
} = require("../controllers/resumeController");

// Create a resume
router.post("/", auth, createResume);

// Get a resume by ID (with ownership check)
router.get("/:id", auth, getSingleResume);

// Update a resume
router.put("/:id", auth, updateResume);

// Delete a resume
router.delete("/:id", auth, deleteResume);

// Optional: If you need a simpler resume fetch (no user check)
router.get("/:id", auth, getResumeById);

module.exports = router;
