'use strict';

const ClickHouse = require('@apla/clickhouse');

const defaultOptions = {
    timeout: 1000
};

const connections = {};

function getKeyForConnection({ protocol, host, port, user, password }) {
    return `protocol=${protocol}
        host=${host};
        port=${port};
        user=${user};
        password=${password}`;
}

function saveConnection(clickHouseConnection, options) {
    const keyForConnection = getKeyForConnection(options);
    connections[keyForConnection] = clickHouseConnection;
}

function createConnection(options) {
    const ch = new ClickHouse({
        ...defaultOptions,
        ...options
    });
    saveConnection(ch, options);

    return ch;
}

module.exports.getConnection = function (options) {
    const keyForConnection = getKeyForConnection(options);
    if (connections.hasOwnProperty(keyForConnection)) {
        return connections[keyForConnection];
    }

    return createConnection(options);
};
