import React from 'react';

import Logs from './logs/logs';

class QueryThreadLog extends React.Component {
    render() {
        return <Logs tableName="query_thread_log" />;
    }
}

export default QueryThreadLog;
