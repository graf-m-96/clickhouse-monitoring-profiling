const commonKey = 'clickhouse-monitoring';
const connectionsKey = `${commonKey}/connection`;
const queriesKey = `${commonKey}/queries`;

export const getConnections = () => {
    try {
        const value = localStorage.getItem(connectionsKey);

        if (value === null) {
            return [];
        }
    
        return JSON.parse(value);
    } catch (error) {
        console.error(error);
    }
};

export const saveConnections = connections => {
    try {
        localStorage.setItem(connectionsKey, JSON.stringify(connections));
    } catch (error) {
        console.error(error);
    }
};

export const getQueries = () => {
    try {
        const value = localStorage.getItem(queriesKey);

        if (value === null) {
            return [];
        }
    
        return JSON.parse(value);
    }
    catch (error) {
        console.error(error);
        return [];
    }
};

export const saveQueries = queries => {
    try {
        localStorage.setItem(queriesKey, JSON.stringify(queries));
    } catch (error) {
        console.error(error);
    }
};
