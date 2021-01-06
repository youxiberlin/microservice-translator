const getTranslation = async (req, res) => {
  res.send('translated');
};

const postData = async (req, res) => {
  res.send('data posted');
};

module.exports = {
  getTranslation,
  postData
};
