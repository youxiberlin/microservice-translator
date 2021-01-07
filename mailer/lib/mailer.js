const nodemailer = require('nodemailer');

const mailer = async () => {
  let transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || "smtp.mailtrap.io",
    port: process.env.MAILTRAP_PORT || 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });

  let info = await transporter.sendMail({
    from: '"Yuki Sato 👻" <sato.youxi@gmail.com>', // sender address
    to: "e9ec4dc18b-5af4c5@inbox.mailtrap.io", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
  mailer
};
