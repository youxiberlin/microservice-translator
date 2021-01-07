const fs = require('fs');
const path  = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '../.env')});

const amqp = require('amqplib')
let lastRequestId = 1;
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

const postData = async (req, res, next) => {
  let requestId = lastRequestId;
  lastRequestId++;

  // connect to Rabbit MQ and create a channel
  let connection = await amqp.connect(messageQueueConnectionString);
  let channel = await connection.createConfirmChannel();
  // publish the data to Rabbit MQ
  let requestData = req.body.data;

  console.log("Published a request message, requestId:", requestId);
  await publishToChannel(channel, { routingKey: "request", exchangeName: "processing", data: { requestId, requestData } });

  res.send({ requestId })
};

function publishToChannel(channel, { routingKey, exchangeName, data }) {
  return new Promise((resolve, reject) => {
    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true }, function (err, ok) {
      if (err) {
        return reject(err);
      }

      resolve();
    })
  });
}


const postText = async (req, res, next) => {
  const email = req.body.email;

  fs.readFile(req.file.path, 'utf8', function(err, data) {
    if (err) throw err;
    const addedEmail = `${email}\n${data}`
    fs.writeFile(req.file.path, addedEmail, (err) => {
      if (err) return console.log(err)
    })
  });

  const file = req.file;

  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
};

module.exports = {
  postText,
  postData
};
