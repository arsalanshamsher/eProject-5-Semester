// models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  weight: Number, // in kg or lbs
  bodyMeasurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    biceps: Number
  },
  performance: {
    runTime: String,        // e.g., "5km in 25 minutes"
    liftRecord: String      // e.g., "Bench press 80kg"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
