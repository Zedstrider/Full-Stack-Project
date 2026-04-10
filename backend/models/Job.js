const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  //Link this job to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // This must exactly match the name of the User model
  },
  role: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true, // Automatically strips whitespace from the ends
    maxlength: [150, 'Role cannot exceed 150 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [150, 'Company name cannot exceed 150 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [150, 'Location cannot exceed 150 characters'],
    default: '' // If the user leaves it blank, save it as an empty string instead of null
  },
  status: {
    type: String,
    required: true,
    enum: ['applied', 'interviewing', 'selected', 'rejected'], 
    default: 'applied' // Automatically drops new jobs into the first column
  },
  interviewDate: { 
    type: Date, 
    required: false 
  },
  applicationLink: { 
    type: String, 
    required: false 
  },
  resumeFile: { 
    type: String, 
    required: false // This will eventually store the Cloudinary/S3 URL of your PDF
  }
}, {
  // This automatically adds 'createdAt' and 'updatedAt' timestamps to every entry!
  timestamps: true 
});

module.exports = mongoose.model('Job', jobSchema);