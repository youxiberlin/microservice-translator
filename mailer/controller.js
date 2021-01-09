require('dotenv').config({ path: '../.env' })
const fs = require('fs').promises;
const { mailer } = require('./lib/mailer');
const { makeFinalOutput } = require('./lib/result-formatter');
const mailsender = process.env.DEV_MAILSENDER;
const mailrecipient = process.env.DEV_MAILRECIPIENT;

const postText = async (req, res, next) => {
  const { result, original, email } = req.body;
  const output = makeFinalOutput(result, original)
  const filename = `${req.body.docId}.txt`;
  const path = `data/email/${filename}`;
  try {
    await fs.appendFile(path, output)
  } catch(err) {
    console.error(err)
  }

  await mailer(
    {
      from: mailsender,
      to: mailrecipient || email,
      subject: "Here is your translation ✔",
      text: "Your translation is done! Please see the attached. :)",
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
