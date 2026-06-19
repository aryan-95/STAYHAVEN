const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth.middleware');

// Local storage setup
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// @POST /api/upload/images
router.post('/images', protect, upload.array('images', 10), (req, res) => {
  try {
    const urls = req.files.map(f => ({
      url: `${process.env.API_URL || 'http://localhost:5000'}/uploads/${f.filename}`,
      publicId: f.filename
    }));
    res.json({ success: true, images: urls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/upload/avatar
router.post('/avatar', protect, upload.single('avatar'), (req, res) => {
  try {
    const url = `${process.env.API_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
