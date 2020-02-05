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

const min = 5;
const step = 15
const max = min + step * 4;
let countQueryInSeconds = min;
let isIncrement = true;

const query = `select * from
remote('127.0.0.1:9000', system.query_log, 'default', '1')
limit 1000`;

async function sendQueries() {
    const array = [];
    for (let i = 0; i < countQueryInSeconds; i++) {
        array.push(ch.querying(query));
    }

    await Promise.all(array)
        // eslint-disable-next-line no-empty-function
        .catch(() => {});

    setTimeout(sendQueries, 1000);
}

setInterval(() => {
    if (countQueryInSeconds === min) {
        isIncrement = true;
    } else if (countQueryInSeconds === max) {
        isIncrement = false;
    }

    if (isIncrement) {
        countQueryInSeconds += step;
    } else {
        countQueryInSeconds -= step;
    }
}, 60 * 1000);

sendQueries();
