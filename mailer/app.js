require('dotenv').config({ path: '../.env' })
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const port = process.env.MAILERPORT || 3002;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/', routes);
app.listen(port, () => console.log(`App listening at port ${port}`));
