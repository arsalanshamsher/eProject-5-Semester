// controllers/workoutController.js
const Workout = require('../models/Workout');

const addWorkout = async (req, res) => {
  const { title, category, exercises } = req.body;

  try {
    const newWorkout = new Workout({
      user: req.user._id,
      title,
      category,
      exercises
    });

    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add workout', error: err.message });
  }
};

const getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching workouts', error: err.message });
  }
};

const updateWorkout = async (req, res) => {
  const workoutId = req.params.id;

  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update workout', error: err.message });
  }
};

const deleteWorkout = async (req, res) => {
  const workoutId = req.params.id;

  try {
    const deleted = await Workout.findOneAndDelete({ _id: workoutId, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Workout not found' });

    res.json({ message: 'Workout deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete workout', error: err.message });
  }
};

module.exports = {
  addWorkout,
  getUserWorkouts,
  updateWorkout,
  deleteWorkout,
};
