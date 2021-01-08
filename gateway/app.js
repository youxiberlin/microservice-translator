require('dotenv').config({ path: '../.env' })
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const port = process.env.GATEWAY_PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/data', routes);

app.listen(port, () => console.log(`App listening at port ${port}`));
