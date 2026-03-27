require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Allows your React app to make requests here
app.use(express.json()); // Allows Express to parse JSON data from requests

// A simple test route to make sure the server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is up and running successfully!' });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});