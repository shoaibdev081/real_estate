
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload directory
const uploadDir = './uploads';

// File size limits
const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const VIDEO_MAX_SIZE = 100 * 1024 * 1024; // 100 MB

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const unique =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(
      null,
      file.fieldname + '-' + unique + path.extname(file.originalname)
    );
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  const videoTypes = /mp4|mov|avi|mkv|webm/;

  const ext = path.extname(file.originalname)
    .toLowerCase()
    .replace('.', '');

  const mime = file.mimetype;

  // Allow images
  if (
    imageTypes.test(ext) &&
    mime.startsWith('image/')
  ) {
    return cb(null, true);
  }

  // Allow videos
  if (
    videoTypes.test(ext) &&
    mime.startsWith('video/')
  ) {
    return cb(null, true);
  }

  return cb(
    new Error('Only image and video files are allowed')
  );
};

// Multer configuration
// Global maximum size: 100 MB
const upload = multer({
  storage,

  limits: {
    fileSize: VIDEO_MAX_SIZE
  },

  fileFilter
});

// Individual file size validation
const validateFileSizes = (req, res, next) => {
  const files = req.files
    ? Object.values(req.files).flat()
    : req.file
      ? [req.file]
      : [];

  // Find images exceeding 5 MB
  const oversizedImage = files.find(file =>
    file.mimetype.startsWith('image/') &&
    file.size > IMAGE_MAX_SIZE
  );

  if (oversizedImage) {
    // Delete uploaded files
    files.forEach(file => {
      fs.unlink(file.path, err => {
        if (err) {
          console.error('File cleanup error:', err);
        }
      });
    });

    return res.status(400).json({
      success: false,
      message: 'Image size must not exceed 5MB'
    });
  }

  next();
};

// Gallery upload configuration
const galleryUpload = [
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'otherImages', maxCount: 20 }
  ]),

  validateFileSizes
];

// Export middleware
module.exports = {
  upload,
  galleryUpload,
  validateFileSizes
};
