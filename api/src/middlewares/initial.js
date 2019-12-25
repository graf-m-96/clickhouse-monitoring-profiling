'use strict';

module.exports = (req, res, next) => {
    req.locals = {};
    next();
};
