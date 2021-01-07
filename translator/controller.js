const amqp = require('amqplib');
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

let lastRequestId = 1

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
