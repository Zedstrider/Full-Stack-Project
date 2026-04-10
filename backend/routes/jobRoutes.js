const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

//Import the upload middleware
const upload = require('../middleware/uploadMiddleware');

// Add upload.single('resumeFile') to the POST route
router.route('/')
  .get(protect, getJobs)
  .post(protect, upload.single('resumeFile'), createJob);

// Add it to the PUT route as well, in case you upload a resume during an edit
router.route('/:id')
  .put(protect, upload.single('resumeFile'), updateJob)
  .delete(protect, deleteJob);

module.exports = router;