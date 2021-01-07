const postText = async (req, res, next) => {
  console.log(req.body)
  if (res.statusCode === 200) {
    console.log('Recived Data')
    res.send({
      message: 'Successfully uploaded'
    });
  }
};

module.exports = {
  postText
};
