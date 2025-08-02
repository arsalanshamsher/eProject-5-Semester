// routes/nutritionRoutes.js
const express = require('express');
const router = express.Router();
const {
  addNutrition,
  getNutritionLogs,
  deleteNutritionLog
} = require('../controllers/nutritionController');

const protect = require('../middleware/authMiddleware');

router.post('/', protect, addNutrition);         // Add new log
router.get('/', protect, getNutritionLogs);      // Get all logs
router.delete('/:id', protect, deleteNutritionLog); // Delete a log

module.exports = router;
