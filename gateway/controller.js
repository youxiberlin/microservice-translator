const fs = require('fs').promises;
const axios = require('axios');
const { handleError } = require('./lib/error');
const { validateEmail } = require('./lib/validator');
const translatorPort = process.env.TRANSLATOR_PORT || 3001;

let lastRequestId = 1;

const postText = async (req, res, next) => {
  let requestId = lastRequestId;
  lastRequestId++;
  let data;
  const { email } = req.body;
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.statusCode = 400;
    handleError(error, res)
    return next(error);
  }
  if (!email) {
    const error = new Error('Please input an email');
    error.statusCode = 400;
    handleError(error, res);
    return next(error);
  }
  if (!validateEmail(email)) {
    const error = new Error('Please input a valid email');
    error.statusCode = 400;
    handleError(error, res);
    return next(error);
  }

  const path = req.file.path;
  try {
    data = await fs.readFile(path, 'utf8')
    const addedEmail = `${email}\n${data}`
    await fs.writeFile(path, addedEmail)
  } catch(err) {
    console.error(err)
  }


  axios.post(`http://localhost:${translatorPort}/upload`, {
    data,
    email,
  })
  .then(function (response) {
    if (response.status === 200) {
      console.log('Data passed to Translator:', response.data);
    }
  })
  .catch(function (error) {
    console.log('Error at passing data to translator:', error);
  });


  res.send({
    message: `Successfully uploaded ${file.originalname}`,
    id: requestId
  })
};

module.exports = {
  postText,
};
