const fs = require('fs').promises;
const axios = require('axios');
const translatorPort = process.env.TRANSLATOR_PORT || 3001;

let lastRequestId = 1;

const postText = async (req, res, next) => {
  let requestId = lastRequestId;
  lastRequestId++;
  const email = req.body.email;
  const path = req.file.path;
  let data;
  try {
    data = await fs.readFile(path, 'utf8')
    const addedEmail = `${email}\n${data}`
    await fs.writeFile(path, addedEmail)
  } catch(err) {
    console.error(err)
  }

  axios.post(`http://localhost:${translatorPort}/upload`, {
    data,
  })
  .then(function (response) {
    if (response.status === 200) {
      console.log(response.data)
    }
  })
  .catch(function (error) {
    console.log(error);
  });

  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }

  res.send({
    message: `Successfully uploaded ${file.originalname}`,
    id: requestId
  })
};

module.exports = {
  postText,
};
