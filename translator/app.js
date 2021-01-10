require('dotenv').config({ path: '../.env' })
const fs = require('fs').promises;
const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const axios = require('axios');
const messageQueueConnectionString = process.env.AMQP_URL;
const port = process.env.TRANSLATOR_PORT || 3001;
const routes = require('./routes');
const { separateEmail } = require('./lib/formatter')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use('/upload', routes);

const listenForResults = async () => {
  let connection = await amqp.connect(messageQueueConnectionString);
  let channel = await connection.createChannel();
  await channel.prefetch(1);
  await consume({ connection, channel });
}

const consume = async ({ connection, channel, resultsChannel }) => {
  return new Promise((resolve, reject) => {
    channel.consume("processing.results", async function (msg) {
      let msgBody = msg.content.toString();
      let data = JSON.parse(msgBody);
      let requestId = data.requestId;
      let docId = data.docId
      let processingResults = data.processingResults;
      let resultText = processingResults.join('\n');
      let originalText;
      try {
        await fs.appendFile(`data/results/${docId}.txt`, resultText)
        originalText = await fs.readFile(`data/uploads/${docId}.txt`, 'utf8');
      } catch(err) {
        console.error(err)
      }
      console.log("Received a result message, requestId:", requestId, "docID", docId, "processingResults:", processingResults);
      await channel.ack(msg);
      const { email, original } = separateEmail(originalText)
      axios.post('http://localhost:3002/email', {
        email,
        docId,
        result: resultText,
        original,
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log('Data passed to Mailer:', response.data)
        }
      })
      .catch(function (error) {
        console.log('Error at passing data to Mailer:', error);
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

app.listen(port, () => console.log(`App listening at port ${port}`));

listenForResults();
