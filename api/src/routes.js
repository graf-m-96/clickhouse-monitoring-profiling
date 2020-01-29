'use strict';

const clickHouseController = require('./controllers/clickhouse');

module.exports = app => {
    app.post('/ping', clickHouseController.ping);
    app.post('/clusters', clickHouseController.clusters);
    app.post('/ping_remote', clickHouseController.pingRemote);
    app.post('/query', clickHouseController.query);
};
