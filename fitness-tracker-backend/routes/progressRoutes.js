// routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const { addProgress, getProgressLogs } = require('../controllers/progressController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, addProgress);
router.get('/', protect, getProgressLogs);

module.exports = router;
