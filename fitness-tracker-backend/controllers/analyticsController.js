// controllers/analyticsController.js
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');

const getWorkoutAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get workout count per day (last 7 days)
    const workouts = await Workout.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ workouts });
  } catch (err) {
    res.status(500).json({ message: 'Workout analytics failed', error: err.message });
  }
};

const getNutritionAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Group by date and sum calories/macros
    const nutrition = await Nutrition.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCalories: { $sum: "$calories" },
          totalProtein: { $sum: "$protein" },
          totalCarbs: { $sum: "$carbs" },
          totalFats: { $sum: "$fats" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ nutrition });
  } catch (err) {
    res.status(500).json({ message: 'Nutrition analytics failed', error: err.message });
  }
};

module.exports = { getWorkoutAnalytics, getNutritionAnalytics };
