const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { exportWorkoutsCSV, exportNutritionPDF } = require('../controllers/exportController');

router.get('/workouts/csv', protect, exportWorkoutsCSV);
router.get('/nutrition/pdf', protect, exportNutritionPDF);

module.exports = router;
