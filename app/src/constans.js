export const connectionFields = {
    connectionName: 'connectionName',
    host: 'host',
    port: 'port',
    user: 'user',
    password: 'password'
};

export const connectionFieldsTranslation = {
    [connectionFields.connectionName]: 'Имя подключения',
    [connectionFields.host]: 'Хост',
    [connectionFields.port]: 'Порт',
    [connectionFields.user]: 'Пользователь',
    [connectionFields.password]: 'Пароль'
};

export const connectionFieldsInOrder = [
    connectionFields.connectionName,
    connectionFields.host,
    connectionFields.port,
    connectionFields.user,
    connectionFields.password
]
    .map(field => connectionFieldsTranslation[field]);

export const hostStatuses = {
    running: 'running',
    unachievable: 'unachievable',
    waiting: 'waiting'
};

export const answerToHostStatus = {
    'No signal\n': hostStatuses.unachievable,
    'Ok.\n': hostStatuses.running
};
