// controllers/settingsController.js
const User = require('../models/User');

const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    const settings = user.settings || getDefaultSettings();
    
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching settings", error: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { notifications, units, privacy, theme } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        settings: { notifications, units, privacy, theme }
      },
      { new: true, runValidators: true }
    ).select('settings');

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser.settings);
  } catch (err) {
    res.status(500).json({ message: "Error updating settings", error: err.message });
  }
};

const getDefaultSettings = () => {
  return {
    notifications: {
      workoutReminders: true,
      mealReminders: true,
      progressUpdates: true,
      goalAchievements: true
    },
    units: {
      weight: 'kg',
      height: 'cm',
      distance: 'km'
    },
    privacy: {
      profileVisibility: 'public',
      progressSharing: false,
      workoutSharing: false
    },
    theme: 'dark'
  };
};

module.exports = { getSettings, updateSettings };
