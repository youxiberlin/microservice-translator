require('dotenv').config()
const amqp = require('amqplib');
const { mailer } = require('./lib/mailer');
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

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
      //TODO extract email from the data and put it to email destination
      let processingResults = await mailer(
        {
          from: '"Yuki Sato 👻" <sato.youxi@gmail.com>', // sender address
          to: "e9ec4dc18b-5af4c5@inbox.mailtrap.io", // list of receivers
          subject: "Here is your translation ✔", // Subject line
          text: requestData, // plain text body
        }
      ).catch(console.err);

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

listenForMessages();
