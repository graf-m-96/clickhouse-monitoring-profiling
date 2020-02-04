'use strict';

const ClickHouse = require('@apla/clickhouse');

const defaultOptions = {
    timeout: 1000
};
const options = {
    host: '127.0.0.1',
    port: 8123,
    user: 'default',
    password: 1
};

const ch = new ClickHouse({
    ...defaultOptions,
    ...options
});

let countQueryInSeconds = 1;
const module = 1000;

async function sendQueries() {
    const array = [];
    for (let i = 0; i < countQueryInSeconds; i++) {
        array.push(ch.pinging());
    }

    await Promise.all(array)
        // eslint-disable-next-line no-empty-function
        .catch(() => {});

    countQueryInSeconds = (countQueryInSeconds + 1) % module;

    setTimeout(sendQueries, 1000);
}
