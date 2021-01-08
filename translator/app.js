require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const axios = require('axios');
const messageQueueConnectionString = process.env.AMQP_URL;
const port = process.env.PORT || 3001;
const routes = require('./routes');

const app = express();

async function listenForResults() {
  let connection = await amqp.connect(messageQueueConnectionString);
  let channel = await connection.createChannel();
  await channel.prefetch(1);
  await consume({ connection, channel });
}

function consume({ connection, channel, resultsChannel }) {
  return new Promise((resolve, reject) => {
    channel.consume("processing.results", async function (msg) {
      let msgBody = msg.content.toString();
      let data = JSON.parse(msgBody);
      let requestId = data.requestId;
      let processingResults = data.processingResults;
      console.log("Received a result message, requestId:", requestId, "processingResults:", processingResults);
      await channel.ack(msg);
      axios.post('http://localhost:3002/email', {
        data: processingResults
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    });

    connection.on("close", (err) => {
      return reject(err);
    });
 
    connection.on("error", (err) => {
      return reject(err);
    });
  });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use('/upload', routes);

app.listen(port, () => console.log(`App listening at port ${port}`));

listenForResults();
