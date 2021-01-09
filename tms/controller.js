const fs = require('fs').promises;
const { handleError } = require('./lib/error');
const { validateDictObj } = require('./lib/validator');

const postData = async (req, res, next) => {
  const data = req.body

  if (!validateDictObj(data)) {
    const error = new Error('Please input a valid dictionary data');
    error.statusCode = 400;
    handleError(error, res)
    return next(error);
  }

  try {
    const dictData = await fs.readFile('./data/dictionary.json', 'utf8')
    const jsonData = JSON.parse(dictData)
    jsonData.push(data)
    await fs.writeFile('./data/dictionary.json', JSON.stringify(jsonData))
  } catch(err) {
    console.error(err)
  }

  res.json('data posted');
};

module.exports = {
  postData
};
