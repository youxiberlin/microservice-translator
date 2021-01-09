const fs = require('fs').promises;

const postData = async (req, res, next) => {
  const data = req.body
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
