const fs =  require('fs');
const axios = require('axios');

let lastRequestId = 1;

const postText = async (req, res, next) => {
  let requestId = lastRequestId;
  lastRequestId++;
  const email = req.body.email;

  fs.readFile(req.file.path, 'utf8', async function(err, data) {
    if (err) throw err;
    const addedEmail = `${email}\n${data}`
    // Save the uploaded file to /uploads folder
    fs.writeFile(req.file.path, addedEmail, (err) => {
      if (err) return console.log(err)
    })
    // Send the data to translator
    axios.post('http://localhost:3001/upload', {
      email,
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
