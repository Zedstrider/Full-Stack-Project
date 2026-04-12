require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Allows your React app to make requests here
app.use(express.json()); // Allows Express to parse JSON data from requests

//Import and use the job routes
const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes);
// A simple test route to make sure the server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is up and running successfully!' });
});

//Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// --- FORCE FILE DOWNLOAD ROUTE ---
app.get('/api/download', (req, res) => {
  const filePath = req.query.path;
  
  if (!filePath) {
    return res.status(400).json({ message: 'No file path provided' });
  }

  const path = require('path');
  // Combine the current directory with the requested file path
  const absolutePath = path.join(__dirname, filePath);

  // res.download() forces the browser to save the file instead of opening it
  res.download(absolutePath, (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(404).send("File not found on server.");
    }
  });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});