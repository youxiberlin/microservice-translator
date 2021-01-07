require('dotenv').config()
const nodemailer = require('nodemailer');

const mailer = async (mailObj) => {
  let transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || "smtp.mailtrap.io",
    port: process.env.MAILTRAP_PORT || 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });

  let info = await transporter.sendMail(mailObj);

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
  mailer
};
