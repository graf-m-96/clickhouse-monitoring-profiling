import React from 'react';
import PropTypes from 'prop-types';

import { MainContext } from '../../../../contexts';
import Table from '../../table/table';
import ApiManager from '../../../../lib/requests';
import { hostStatuses } from '../../../../constans';

import css from './tableSql.css';

class TableSql extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps) {
        if (this.props.query !== prevProps.query) {
            this.sendQuery();
        }
    }

    static contextType = MainContext;

    sendQuery = async () => {
        try {
            const { query } = this.props;
            const { connections, connectionIndex } = this.context;
            const connection = connections[connectionIndex];
            const logs = await ApiManager.sendQuery(connection, query);
            this.setLogs(logs);
        } catch (error) {
            this.setError(error);
        }
    };

    setLogs = logs => {
        const { columns, data } = this.prepareAnswer(logs);
        this.setState({ logs, columns, data, error: false });
    };

    prepareAnswer = logs => {
        const columns = logs.meta.map(column => ({
            Header: column.name,
            accessor: column.name,
            type: column.type
        }));
        const data = logs.data.map(log => {
            return log.reduce((acc, field, index) => {
                acc[logs.meta[index].name] = field;

                return acc;
            }, {});
        });

        return {
            columns,
            data
        };
    };

    setError = error => {
        this.setState({ error: error.message });
    };

    renderContent() {
        const { connectionIndex, connectionsStatuses } = this.context;
        const { logs, columns, data, error, hiddenColumns } = this.state;

        if (connectionIndex === undefined) {
            return (
                <div className={css.errorMessage}>
                    Connection is not selected
                </div>
            );
        }

        if (connectionsStatuses[connectionIndex] === hostStatuses.unachievable) {
            return (
                <div className={css.errorMessage}>
                    Connection is not unachievable
                </div>
            );
        }

        if (error) {
            return (
                <div className={css.errorMessage}>
                    {error}
                </div>
            );
        }

        if (!logs) {
            return (
                <div className={css.errorMessage}>
                    Query is not selected
                </div>
            );
        }

        return (
            <Table
                allColumns={columns}
                data={data}
                hiddenColumns={hiddenColumns}
                updateWhere={this.updateWhere}
                options={{ useFilter: false }}
            />
        );
    }

    render() {
        return (
            <>
                <div className={css.title}>Table</div>
                {this.renderContent()}
            </>
        );
    }
}

TableSql.propTypes = {
    query: PropTypes.any
};


export default TableSql;
