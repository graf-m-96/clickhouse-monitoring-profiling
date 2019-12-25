'use strict';

const clickHouseController = require('./controllers/clickhouse');

module.exports = app => {
    app.post('/ping', clickHouseController.ping);
    app.post('/clusters', clickHouseController.clusters);
    app.post('/remote', clickHouseController.remote);
    app.post('/query_log', clickHouseController.query_log);
};
