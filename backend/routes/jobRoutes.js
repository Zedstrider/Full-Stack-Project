const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');
//Import the protect middleware
const { protect } = require('../middleware/authMiddleware');

// Add 'protect' as the first argument to secure the routes
router.route('/')
  .get(protect, getJobs)
  .post(protect, createJob);

router.route('/:id')
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;