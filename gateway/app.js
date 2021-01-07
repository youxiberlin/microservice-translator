const path  = require('path');
require('dotenv').config({path:  path.resolve(process.cwd(), '../.env')});

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { port } = require('./config');
const amqp = require('amqplib')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/data', routes);

const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

async function listenForResults() {
  // connect to Rabbit MQ
  let connection = await amqp.connect(messageQueueConnectionString);

  // create a channel and prefetch 1 message at a time
  let channel = await connection.createChannel();
  await channel.prefetch(1);

  // start consuming messages
  await consume({ connection, channel });
}
// consume messages from RabbitMQ
function consume({ connection, channel, resultsChannel }) {
  return new Promise((resolve, reject) => {
    channel.consume("processing.results", async function (msg) {
      // parse message
      let msgBody = msg.content.toString();
      let data = JSON.parse(msgBody);
      let requestId = data.requestId;
      let processingResults = data.processingResults;
      console.log("Received a result message, requestId:", requestId, "processingResults:", processingResults);

      // acknowledge message as received
      await channel.ack(msg);
    });

    // handle connection closed
    connection.on("close", (err) => {
      return reject(err);
    });

    // handle errors
    connection.on("error", (err) => {
      return reject(err);
    });
  });
}

app.listen(port, () => console.log(`App listening at port ${port}`));
listenForResults();
