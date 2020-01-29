const commonKey = 'clickhouse-monitoring';
const connectionsKey = `${commonKey}/connection`;
const queriesKey = `${commonKey}/queries`;

export const getConnections = () => {
    const value = localStorage.getItem(connectionsKey);

    if (value === null) {
        return [];
    }

    return JSON.parse(value);
};

export const saveConnections = connections => {
    localStorage.setItem(connectionsKey, JSON.stringify(connections));
};

export const getQueries = () => {
    const value = localStorage.getItem(queriesKey);

    if (value === null) {
        return [];
    }

    return JSON.parse(value);
};

export const saveQueries = queries => {
    localStorage.setItem(queriesKey, JSON.stringify(queries));
};
