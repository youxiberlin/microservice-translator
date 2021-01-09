const express = require('express');
const { postData } = require('./controller');
const router = express.Router();


router.post('/', postData);

module.exports = router;