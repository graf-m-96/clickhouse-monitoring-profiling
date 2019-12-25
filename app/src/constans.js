export const connectionFields = {
    connectionName: 'connectionName',
    host: 'host',
    port: 'port',
    user: 'user',
    password: 'password'
};
export const connectionInOrder = [
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
