const fs =  require('fs');
const amqp = require('amqplib');
const messageQueueConnectionString = process.env.AMQP_URL;
const { nanoid } = require('nanoid');

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
const extract = (s) => {
  const splitted = s.split(' ');
  return splitted.slice(4, splitted.length).join(' ')
}

const postText = async (req, res, next) => {
  let requestId = lastRequestId;
  lastRequestId++;

  let connection = await amqp.connect(messageQueueConnectionString);
  let channel = await connection.createConfirmChannel();

  console.log('req.body', req.body)
  const { data, email } = req.body;
  const docId = nanoid();
  fs.writeFile(`data/uploads/${docId}.txt`, `${email}\n${data}`, (err) => {
    if (err) return console.log(err)
  })

  let requestData = req.body.data;
  const extracted = requestData.split('\n').map(item => extract(item))
  console.log("Published a request message, requestId:", requestId);
  await publishToChannel(channel, { routingKey: "request", exchangeName: "processing", data: { requestId, extracted, docId } });
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
