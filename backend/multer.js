const multer = require("multer");

// Use memory storage for cloudinary uploads
const storage = multer.memoryStorage();

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});
