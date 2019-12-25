'use strict';

const connection = require('../connections');

module.exports = (req, res, next) => {
    const { host, port, user, password } = req.body;

    req.locals.ch = connection.getConnection({ host, port, user, password });
    next();
};
