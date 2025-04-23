const express = require('express');
const router = express.Router();

const { enhanceResume, getEnhancedResume } = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

console.log("auth type:", typeof auth);
console.log("enhanceResume type:", typeof enhanceResume);

router.get('/test', (req, res) => res.send('Working'));

router.post('/enhance', auth, enhanceResume);
router.get('/enhance', auth, getEnhancedResume);

module.exports = router;
