const multer = require('multer');
const path = require('path');

// Configure where and how to save the files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This tells Multer to save files in a folder named 'uploads'
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Creates a unique filename: timestamp-originalName.pdf
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Create the filter to only accept PDFs and Word Docs
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|doc|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed!'));
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: fileFilter
});

module.exports = upload;