'use strict';

module.exports = class ServerError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
};
