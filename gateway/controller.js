const fs = require('fs').promises;
const axios = require('axios');
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
    res.status(400).json({
      status: 'Error',
      statusCode: 400,
      message: 'Please upload a file'
    });
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

  if (!email) {
    const error = new Error('Please input an email');
    res.status(400).json({
      status: 'Error',
      statusCode: 400,
      message: 'Please input an email'
    });
    return next(error);
  }

  axios.post(`http://localhost:${translatorPort}/upload`, {
    data,
    email,
  })
  .then(function (response) {
    if (response.status === 200) {
      console.log(response.data)
    }
  })
  .catch(function (error) {
    console.log(error);
  });


  res.send({
    message: `Successfully uploaded ${file.originalname}`,
    id: requestId
  })
};

module.exports = {
  postText,
};
