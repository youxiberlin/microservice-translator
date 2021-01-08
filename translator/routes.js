const express = require('express');
const path = require('path');
const multer = require('multer');
const { postText } = require('./controller');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'data/uploads');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', postText);
// router.post('/', upload.single('subtitle-text'), postText);

module.exports = router;