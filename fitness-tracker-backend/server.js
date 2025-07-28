const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');



// App Config
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

// DB Config
mongoose.connect(process.env.MONGO_URI, {

})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.send('Fitness Tracker API is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
