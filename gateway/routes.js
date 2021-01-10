const fs = require('fs');
const express = require('express');
const path = require('path');
const multer = require('multer');
const { postText } = require('./controller');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads', { recursive: true })
    }
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('subtitle-text'), postText);

module.exports = router;
