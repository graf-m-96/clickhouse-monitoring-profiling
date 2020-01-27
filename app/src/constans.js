export const connectionFields = {
    connectionName: 'connection name',
    host: 'host',
    port: 'port',
    user: 'user',
    password: 'password'
};

export const connectionFieldsInOrder = [
    connectionFields.connectionName,
    connectionFields.host,
    connectionFields.port,
    connectionFields.user,
    connectionFields.password
];

export const hostStatuses = {
    running: 'running',
    unachievable: 'unachievable',
    waiting: 'waiting'
};

export const answerToHostStatus = {
    'No signal\n': hostStatuses.unachievable,
    'Ok.\n': hostStatuses.running
};
