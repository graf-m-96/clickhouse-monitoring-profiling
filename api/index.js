'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const config = require('./config.js');
const initialMiddleware = require('./src/middlewares/initial');
const createConnectionMiddleware = require('./src/middlewares/createConnection');
const errorHandlerMiddleware = require('./src/middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(initialMiddleware);
app.use(createConnectionMiddleware);

require('./src/routes')(app);
app.use(errorHandlerMiddleware);

const port = config.port;
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Сервис работает на ${config.port} порту`));
