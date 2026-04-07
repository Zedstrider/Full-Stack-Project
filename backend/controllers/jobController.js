const Job = require('../models/Job');

// 1. GET ALL JOBS
const getJobs = async (req, res) => {
  try {
    //Only find jobs where the 'user' field matches the logged-in user's ID
    const jobs = await Job.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. CREATE A NEW JOB
const createJob = async (req, res) => {
  try {
    //Attach the logged-in user's ID to the job data before saving
    req.body.user = req.user.id;
    
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
    if (!job) return res.status(404).json({ message: 'Job not found' });

    //SECURITY CHECK: Ensure the logged-in user owns this specific job
    if (job.user.toString() !== req.user.id) {
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
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job successfully deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };