'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    console.error(err);
    res.status(err.status).send(err.message);
};
