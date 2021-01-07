const express = require('express');
const path = require('path');
const multer = require('multer');
const { postText, postData } = require('./controller');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('subtitle-text'), postText);
router.post('/process', upload.single('subtitle-text'), postData);

module.exports = router;