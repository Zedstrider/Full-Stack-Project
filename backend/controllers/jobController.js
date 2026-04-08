const Job = require('../models/Job');

// 1. GET ALL JOBS
const getJobs = async (req, res) => {
  try {
    // Failsafe: Ensure req.user exists before trying to read its _id
    if (!req.user) return res.status(401).json({ message: 'User not found' });

    const jobs = await Job.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. CREATE A NEW JOB
const createJob = async (req, res) => {
  try {
    // Failsafe: Ensure req.user exists before saving
    if (!req.user) return res.status(401).json({ message: 'User not found' });

    req.body.user = req.user._id;
    
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. UPDATE A JOB
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found in database' });

    // Failsafe 1: If the middleware failed or req.user is missing, stop immediately
    if (!req.user) {
      return res.status(401).json({ message: 'User session missing. Cannot update job.' });
    }

    // Failsafe 2: If the job doesn't belong to anyone (legacy test data), stop immediately
    if (!job.user) {
       return res.status(401).json({ message: 'This is a legacy job entry. Please delete it.' });
    }

    // Security Check: Does the logged-in user own this specific job?
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4. DELETE A JOB
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    //SECURITY CHECK: Ensure the logged-in user owns this specific job
    if (!job.user || job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job successfully deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };