const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createResume,
 deleteResume,
  updateResume,
   getResumeById,
  getAllResumes,

} = require("../controllers/resumeController");

console.log('Controller functions:', {
  createResume: typeof createResume,
  getAllResumes: typeof getAllResumes
});
 
// Create a resume
router.post("/", auth, createResume);
// GET all resumes for logged-in user
router.get('/', auth, getAllResumes);
// update a resume
router.put('/:id', updateResume);

// Delete a resume
router.delete("/:id", auth, deleteResume);

// Optional: If you need a simpler resume fetch (no user check)
router.get("/:id", auth, getResumeById);



module.exports = router;
