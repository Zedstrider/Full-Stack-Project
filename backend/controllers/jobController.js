const Job = require('../models/Job');

// 1. GET ALL JOBS
// @route GET /api/jobs
const getJobs = async (req, res) => {
  try {
    // .sort({ updatedAt: -1 }) ensures the most recently interacted-with jobs appear first
    const jobs = await Job.find().sort({ updatedAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. CREATE A NEW JOB
// @route POST /api/jobs
const createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob); // 201 means "Created"
  } catch (error) {
    // 400 means "Bad Request" (e.g., they failed your Schema validation)
    res.status(400).json({ message: error.message });
  }
};

// 3. UPDATE A JOB (Used for editing details OR dragging to a new column)
// @route PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true,           // Returns the newly updated document instead of the old one
        runValidators: true  // Forces Mongoose to check the Schema rules again (crucial!)
      }
    );
    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
    
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4. DELETE A JOB
// @route DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
    
    res.status(200).json({ message: 'Job successfully deleted', id: deletedJob._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };