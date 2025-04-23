const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

router.post("/", auth, createResume);
router.get("/", auth, getUserResumes);
router.get("/:id", auth, getResumeById);
router.put("/:id", auth, updateResume);
router.delete("/:id", auth, deleteResume);

module.exports = router;
