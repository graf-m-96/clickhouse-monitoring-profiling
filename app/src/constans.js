export const connectionInputs = {
    'connection name': 'connection name',
    host: 'host',
    port: 'port',
    user: 'user',
    password: 'password'
};

export const connectionInputsInOrder = [
    connectionInputs['connection name'],
    connectionInputs.host,
    connectionInputs.port,
    connectionInputs.user,
    connectionInputs.password
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
