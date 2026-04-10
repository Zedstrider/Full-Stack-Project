const Job = require('../models/Job');
const fs = require('fs'); 
const path = require('path');

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
    if (!req.user) return res.status(401).json({ message: 'User not found' });

    // 1. Grab all the standard text fields
    const jobData = { ...req.body };
    jobData.user = req.user._id;

    // 2. If Multer successfully intercepted a file, save its path to the database
    if (req.file) {
      // It will save as something like "uploads/167890123-myresume.pdf"
      jobData.resumeFile = req.file.path; 
    }
    
    console.log("Multer found this file:", req.file);
    console.log("Job data about to be saved:", jobData);
    
    const newJob = new Job(jobData);
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

    if (!req.user) {
      return res.status(401).json({ message: 'User session missing. Cannot update job.' });
    }

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this job' });
    }

    // --- HANDLE FILE REMOVAL ---
    if (req.body.resumeFile === 'REMOVE') {
      if (job.resumeFile) {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', job.resumeFile);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); 
        }
      }
      req.body.resumeFile = null; 
    }

    // --- THE FIX: HANDLE NEW FILE UPLOAD DURING EDIT ---
    // If Multer intercepted a new file during this update, grab its path!
    if (req.file) {
      req.body.resumeFile = req.file.path;
    }

    if (req.body.status && req.body.status !== 'interviewing') {
      req.body.interviewDate = null; // Overwrites the ghost data with nothing
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

    if (job.resumeFile) {
      // Create the absolute path to the file
      const filePath = path.join(__dirname, '..', job.resumeFile);
      
      // Check if the file actually exists on the hard drive, then delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); 
      }
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job successfully deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };