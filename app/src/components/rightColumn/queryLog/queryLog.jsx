import React from 'react';
import ReactLoading from 'react-loading';
import classNames from 'classnames';

import { MainContext } from '../../../contexts';
import ApiManager from '../../../lib/requests';
import Table from '../table/table';
import Dropdown from '../../dropdown/dropdown';

import css from './queryLog.css';

const rowLength = 4;

class QueryLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoloadingToggle: false,
            autoloadingTimeout: 3000,
            hiddenColumns: {},
            limitCount: 1000,
            query: '',
        };
        this.autoloadingTimeoutRef = React.createRef();
        this.where = {};
    }

    componentDidMount() {
        this.runPolling();
    }

    static contextType = MainContext;

    runPolling = async () => {
        try {
            const connection = this.context.connections[this.context.connectionIndex];
            const logs = await ApiManager.getQueryLogs(connection);
            this.setLogs(logs);
        } catch (error) {
            this.setError(error);
        }
    }

    setLogs = logs => {
        const { columns, data } = this.prepareAnswer(logs);
        this.setState({ logs, columns, data, error: false });
    };

    setError = error => {
        this.setState({ error: error.message });
    };

    updateWhere = filter => {
        this.where = {
            ...this.where,
            ...filter
        }
    };

    renderSettings = () => {
        return (
            <div className={css.settings}>
                {this.renderAutoloading()}
                {this.renderShownColumns()}
                {this.renderCurrentQuery()}
                {this.renderDbSettings()}
            </div>
        );
    };

    renderAutoloading = () => {
        return (
            <div className={css.autoloading}>
                <Dropdown
                    classNameHeader={css.autoloading__title}
                    header={<div>Autoload</div>}
                >
                    <label className={css.autoloading__button}>
                        <input
                            name="autoloading__toggle"
                            type="checkbox"
                            onClick={this.toggleAutoloading}
                        />
                        Enable autoloading of new logs every
                    </label>
                    <input
                        name="autoloading__number"
                        className={css.autoloading__number}
                        type="number"
                        min="100"
                        disabled
                        value={this.state.autoloadingTimeout}
                        onChange={this.setAutoloaingTimeout}
                        ref={this.autoloadingTimeoutRef}
                    />
                    ms
                </Dropdown>
            </div>
        );
    }

    toggleAutoloading = event => {
        this.autoloadingTimeoutRef.current.disabled = !event.target.checked;
        this.setState({ autoloadingToggle: event.target.checked });
    };

    setAutoloaingTimeout = event => {
        this.setState({ autoloadingTimeout: event.target.value });
    };

    renderShownColumns = () => {
        const rows = [];
        let currentRow = [];
        this.state.columns.forEach(field => {
            if (currentRow.length === rowLength) {
                rows.push(currentRow);
                currentRow = [];
            }

            currentRow.push(field);
        });
        rows.push(currentRow);

        return (
            <div className={css.hiddenColumns}>
                <Dropdown
                    classNameHeader={css.hiddenColumns__title}
                    header={<div>Hidden columns</div>}
                >
                    <table>
                        <tbody>
                            {rows.map((row, indexRow) => (
                                <tr key={indexRow}>
                                    {row.map((field, indexField) => (
                                        <td
                                            className={css.hiddenColumns__ceil}
                                            key={indexField}
                                        >
                                            <label className={css.hiddenColumns__label}>
                                                <input
                                                    type="checkbox"
                                                    onChange={event => this.toggleHiddenColumn(event, field.Header)}
                                                />
                                                {field.Header}
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Dropdown>
            </div>
        );
    };

    renderCurrentQuery = () => {
        return (
            <div className={css.currentQuery}>
                <Dropdown
                    classNameHeader={css.currentQuery__title}
                    header={<div>Current Query</div>}
                >
                    <div className={css.currentQuery__body}>
                        query
                    </div>
                </Dropdown>
            </div>
        );
    };

    renderDbSettings = () => {
        const { limitCount } = this.state;

        return (
            <div className={css.dbSettings}>
                <button
                    className={classNames(css.button, css.dbSettings__button)}
                    onClick={this.onRun}
                >
                    Run
                </button>
                <div className={css.dbSettings__limit}>
                    <div className={css.limit__title}>Limit</div>
                    <input
                        className={css.limit__input}
                        type="number"
                        value={limitCount}
                        onChange={this.setLimit}
                    />
                </div>
                <div className={css.dbSettings__connection}>
                    <div className={css.connection__title}>Connection</div>
                    <input
                        className={css.connection__select}
                    />
                </div>
            </div>
        );
    };

    setLimit = event => {
        this.setState({ limitCount: event.target.value });
    };

    onRun = () => {
        console.log('qq')
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

    render() {
        const { logs, columns, data, error, hiddenColumns } = this.state;

        if (error) {
            return (
                <div className={css.errorMessage}>
                    Error: {error}
                </div>
            );
        }

        if (logs) {
            return (
                <>
                    {this.renderSettings()}
                    <Table
                        allColumns={columns}
                        data={data}
                        hiddenColumns={hiddenColumns}
                        updateWhere={this.updateWhere}
                    />
                </>
            );
        }

        return (
            <ReactLoading
                type="spinningBubbles"
                width="200px"
                height="200px"
                color="rgba(0, 0, 0, 0.3)"
                className={css.loadingAnimation}
            />
        );
    }
}

export default QueryLog;
