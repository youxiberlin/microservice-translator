const amqp = require('amqplib');
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

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
  // save request id and increment
  let requestId = lastRequestId;
  lastRequestId++;

  // connect to Rabbit MQ and create a channel
  let connection = await amqp.connect(messageQueueConnectionString);
  let channel = await connection.createConfirmChannel();

  console.log('req.body', req.body)
  let requestData = req.body.data;
  console.log("Published a request message, requestId:", requestId);
  await publishToChannel(channel, { routingKey: "request", exchangeName: "processing", data: { requestId, requestData } });
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
