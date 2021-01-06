const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { port } = require('./config');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/data', routes);
app.get('/', (req, res) => res.send('hello world'));
app.listen(port, () => console.log(`App listening at port ${port}`));
