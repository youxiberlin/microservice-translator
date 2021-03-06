const fs = require('fs');
const amqp = require('amqplib');
const messageQueueConnectionString = process.env.AMQP_URL;
const { nanoid } = require('nanoid');
const { parseData } = require('./lib/parser')

let lastRequestId = 1;

const publishToChannel = (channel, { routingKey, exchangeName, data }) => {
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
  let requestId = lastRequestId;
  lastRequestId++;

  let connection = await amqp.connect(messageQueueConnectionString);
  let channel = await connection.createConfirmChannel();

  const { data, email } = req.body;
  const docId = nanoid();
  if (!fs.existsSync('data/uploads')) fs.mkdirSync('data/uploads', { recursive: true })
  fs.writeFile(`data/uploads/${docId}.txt`, `${email}\n${data}`, (err) => {
    if (err) return console.log(err)
  })

  let requestData = req.body.data;
  const extracted = parseData(requestData);
  console.log("Published a request message, requestId:", requestId);

  await publishToChannel(channel, { routingKey: "request", exchangeName: "processing", data: { requestId, extracted, docId } });

  if (res.statusCode === 200) {
    res.send({
      message: 'Successfully uploaded'
    });
  }
};

module.exports = {
  postText
};
