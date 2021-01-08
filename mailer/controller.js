const fs = require('fs').promises;
const { mailer } = require('./lib/mailer');

const postText = async (req, res, next) => {
  const translationResults = req.body.data;
  const filename = `${req.body.docId}.txt`;
  const path = `data/email/${filename}`;
  try {
    await fs.appendFile(path, translationResults)
  } catch(err) {
    console.error(err)
  }

  await mailer(
    {
      from: '"Yuki Sato 👻" <sato.youxi@gmail.com>', // sender address
      to: "e9ec4dc18b-5af4c5@inbox.mailtrap.io", // list of receivers
      subject: "Here is your translation ✔", // Subject line
      text: translationResults,
      attachments: [
        {
          filename: 'translation_result.txt',
          path,
        }
      ]
    }
  ).catch(console.err);

  res.send({
    message: `Successfully passed the data to mailer`,
  })
};

module.exports = {
  postText,
};
