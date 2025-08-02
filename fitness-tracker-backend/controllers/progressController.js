// controllers/progressController.js
const Progress = require('../models/Progress');

const addProgress = async (req, res) => {
  const { weight, bodyMeasurements, performance } = req.body;

  try {
    const newProgress = new Progress({
      user: req.user._id,
      weight,
      bodyMeasurements,
      performance
    });

    await newProgress.save();
    res.status(201).json(newProgress);
  } catch (err) {
    res.status(500).json({ message: 'Failed to log progress', error: err.message });
  }
};

const getProgressLogs = async (req, res) => {
  try {
    const logs = await Progress.find({ user: req.user._id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs', error: err.message });
  }
};

module.exports = {
  addProgress,
  getProgressLogs
};
