const express = require('express');
const { postText } = require('./controller');
const router = express.Router();

router.post('/', postText);

module.exports = router;