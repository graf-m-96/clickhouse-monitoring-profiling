import React from 'react';

import Logs from './logs/logs';

class QueryLog extends React.Component {
    render() {
        return <Logs tableName="query_log" />;
    }
}

export default QueryLog;
