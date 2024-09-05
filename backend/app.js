require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const { runBirthdayCheck } = require('./cron/birthdayCron');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://birthday-wisher.hostless.app', // frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
  credentials: true // Allow cookies to be sent with requests
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  // useNewUrlParser: true,
  // useUnifiedTopology: true, (No longer needed in mongodb version 4.0.0)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
});

//Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Handle all other routes by sending the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Routes
app.use('/register', userRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  runBirthdayCheck(); // Start the cron job
});
