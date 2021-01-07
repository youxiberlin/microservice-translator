const fs =  require('fs');
const { mailer } = require('./lib/mailer');

const postText = async (req, res, next) => {
  console.log('req body', req.body)
  const data = req.body.data;

  // TODO save the e-mail data locally as text file
  await mailer(
    {
      from: '"Yuki Sato 👻" <sato.youxi@gmail.com>', // sender address
      to: "e9ec4dc18b-5af4c5@inbox.mailtrap.io", // list of receivers
      subject: "Here is your translation ✔", // Subject line
      text: data,
    }
  ).catch(console.err);

  res.send({
    message: `Successfully passed the data to mailer`,
  })
};

module.exports = {
  postText,
};
