const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');
//Import the protect middleware
const { protect } = require('../middleware/authMiddleware');

// Add 'protect' as the first argument to secure the routes
router.route('/')
  .get(protect, getJobs)
  .post(protect, createJob);

// Clean, chained routing syntax
router.route('/')
  .get(getJobs)
  .post(createJob);

router.route('/:id')
  .put(updateJob)
  .delete(deleteJob);

module.exports = router;