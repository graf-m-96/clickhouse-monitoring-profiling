'use strict';

module.exports.ping = (req, res) => {
    const { ch } = req.locals;

    return ch.pinging()
        .then(() => {
            res.send('Ok.\n');
        })
        .catch(() => {
            res.send('No signal.\n');
        });
};

module.exports.clusters = (req, res) => {
    const { ch } = req.locals;

    return ch.querying('select * from system.clusters')
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send(error);
        });
};

module.exports.pingRemote = (req, res) => {
    const { ch } = req.locals;
    const { otherHost, otherPort, user, password } = req.body;
    const query = `select 1
from remote('${otherHost}:${otherPort}', system.clusters, '${user}', '${password}')
limit 1`;

    return ch.querying(query)
        .then(data => {
            // Ok.\n
            res.send('Ok.\n');
        })
        .catch(() => {
            res.send('No signal.\n');
        });
};

module.exports.queryLog = (req, res) => {
    const { ch } = req.locals;

    const query = 'select * from system.query_log limit 1000';

    return ch.querying(query)
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send(error);
        });
};
