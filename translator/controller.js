const fs = require('fs');

const postText = async (req, res, next) => {
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
