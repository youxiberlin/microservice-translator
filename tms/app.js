require('dotenv').config()
const amqp = require('amqplib');
const messageQueueConnectionString = process.env.AMQP_URL;

async function listenForMessages() {
  let connection = await amqp.connect(messageQueueConnectionString);
  let channel = await connection.createChannel();
  await channel.prefetch(1);
  let resultsChannel = await connection.createConfirmChannel();
  await consume({ connection, channel, resultsChannel });
}

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

function consume({ connection, channel, resultsChannel }) {
  return new Promise((resolve, reject) => {
    channel.consume("processing.requests", async function (msg) {
      let msgBody = msg.content.toString();
      let data = JSON.parse(msgBody);
      let requestId = data.requestId;
      let requestData = data.requestData;
      console.log('data:', data)
      console.log("Received a request message, requestId:", requestId);
      let processingResults = await processMessage(requestData);
      await publishToChannel(resultsChannel, {
        exchangeName: "processing",
        routingKey: "result",
        data: { requestId, processingResults }
      });
      console.log("Published results for requestId:", requestId);
      await channel.ack(msg);
    });

    connection.on("close", (err) => {
      return reject(err);
    });

    connection.on("error", (err) => {
      return reject(err);
    });
  });
}

// simulate data processing that takes 5 seconds
function processMessage(requestData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(requestData + "-processed")
    }, 5000);
  });
}

listenForMessages();