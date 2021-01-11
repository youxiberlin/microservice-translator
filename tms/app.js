require('dotenv').config({ path: '../.env' })
const amqp = require('amqplib');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const port = process.env.TMS_PORT || 3003;
const dictData = require('./data/dictionary.json')
const { translator } = require('./lib/translator')
const messageQueueConnectionString = process.env.AMQP_URL;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/data', routes)

const listenForMessages = async () => {
  let connection = await amqp.connect(messageQueueConnectionString);
  let channel = await connection.createChannel();
  await channel.prefetch(1);
  let resultsChannel = await connection.createConfirmChannel();
  await consume({ connection, channel, resultsChannel });
}

const publishToChannel = async (channel, { routingKey, exchangeName, data }) => {
  return new Promise((resolve, reject) => {
    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true }, function (err, ok) {
      if (err) {
        return reject(err);
      }

      resolve();
    })
  });
}

const consume = async ({ connection, channel, resultsChannel }) => {
  return new Promise((resolve, reject) => {
    channel.consume("processing.requests", async function (msg) {
      let msgBody = msg.content.toString();
      let data = JSON.parse(msgBody);
      let requestId = data.requestId;
      let requestData = data.extracted;
      let docId = data.docId;
      console.log('data:', data)
      console.log("Received a request message, requestId:", requestId);
      let processingResults = await processMessage(requestData);
      await publishToChannel(resultsChannel, {
        exchangeName: "processing",
        routingKey: "result",
        data: { requestId, processingResults, docId }
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
const processMessage = async (requestData) => {
  const result = translator(dictData, requestData)
  return new Promise((resolve, reject) => {
    resolve(result)
  });
}

const server = app.listen(port, () => console.log(`App listening at port ${port}`));
listenForMessages();

module.exports = { server }
