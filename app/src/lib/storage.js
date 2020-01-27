const commonKey = 'clickhouse-monitoring';
const connectionsKey = `${commonKey}/connection`;

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
