fs = require('fs');

const postText = async (req, res, next) => {
  const email = req.body.email;

  fs.readFile(req.file.path, 'utf8', function(err, data) {
    if (err) throw err;
    const addedEmail = `${email}\n${data}`
    fs.writeFile(req.file.path, addedEmail, (err) => {
      if (err) return console.log(err)
    })
  });

  const file = req.file;

  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
};

module.exports = {
  postText
};
