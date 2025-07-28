        // models/Workout.js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true }, // e.g., "Leg Day", "Chest Workout"
  category: { type: String, enum: ['strength', 'cardio'], required: true },
  exercises: [
    {
      name: { type: String, required: true },       // e.g., "Squats"
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
      weight: { type: Number },                     // optional for cardio
      notes: { type: String }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);
