const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// All uploaded images are stored locally on the server in ./uploads
// Cloudinary upload is disabled - files are stored locally and never uploaded to cloud
const uploadOnCloudinary = async (localFilePath, options = {}) => {
  // Always keep file locally on disk in ./uploads and return null so callers use /uploads/${filename}
  return null;
};

module.exports = uploadOnCloudinary;
