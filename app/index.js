'use strict';

const server = require('express')();
const next = require('next');

const config = require('./config');

const app = next({ dev: process.env.NODE_ENV !== 'production', dir: './src' });
const render = pageName => (req, res) => app.render(req, res, pageName);
app.prepare().then(() => {
    server
        .get('*', render('/index'))
        // eslint-disable-next-line no-console
        .listen(config.port, () => console.log(`Сервис работает на ${config.port} порту`));
});
