// controllers/nutritionController.js
const Nutrition = require('../models/Nutrition');

const addNutrition = async (req, res) => {
  const { mealType, items } = req.body;

  try {
    const newEntry = new Nutrition({
      user: req.user._id,
      mealType,
      items
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add nutrition log', error: err.message });
  }
};

const getNutritionLogs = async (req, res) => {
  try {
    const logs = await Nutrition.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
};

const deleteNutritionLog = async (req, res) => {
  try {
    const deleted = await Nutrition.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Log not found' });

    res.json({ message: 'Nutrition log deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

const searchNutrition = async (req, res) => {
  try {
    const { keyword, mealType } = req.query;

    const query = { user: req.user._id };

    if (keyword) {
      query['entries.food'] = { $regex: keyword, $options: 'i' };
    }

    if (mealType) {
      query.mealType = mealType; // breakfast/lunch/dinner/snacks
    }

    const logs = await Nutrition.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Nutrition search failed' });
  }
};

module.exports = {
  addNutrition,
  getNutritionLogs,
  deleteNutritionLog,
  searchNutrition,
};
