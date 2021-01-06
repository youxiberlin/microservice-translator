const fs = require('fs');

const getTranslation = async (req, res) => {
  res.send('translated');
};

const postData = async (req, res, next) => {
  const data = JSON.stringify(req.body)

  fs.writeFile('./data.json', data, (err) => {
    if (err) return console.log(err)
  })
  res.json('data posted');
};

module.exports = {
  getTranslation,
  postData
};
