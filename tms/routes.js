const express = require('express');
const { getTranslation, postData } = require('./controller');
const router = express.Router();

router.get('/translate', getTranslation);
router.post('/data', postData);

module.exports = router;