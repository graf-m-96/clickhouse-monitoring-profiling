import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactLoading from 'react-loading';

import { MainContext } from '../../../contexts';
import ApiManager from '../../../lib/requests';
import Table from '../table/table';
import Dropdown from '../../dropdown/dropdown';
import { hostStatuses } from '../../../constans';
import ClusterDescription from '../clusterDescription/clusterDescription';

import css from './logs.css';

const rowLength = 4;

class Logs extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            autoloadingToggle: false,
            autoloadingTimeout: 20000,
            hiddenColumns: {},
            clusterIndex: 0,
            limitCount: 1000,
            query: ''
        };
        this.autoloadingTimeoutRef = React.createRef();
        this.where = {};
        this.timeoutId = null;
    }

    componentDidMount() {
        this.clusterIsLoaded = this.context.clusters !== undefined;

        if (this.clusterIsLoaded) {
            this.onRun();
        }
    }

    componentDidUpdate() {
        if (!this.clusterIsLoaded && this.context.clusters !== undefined) {
            this.clusterIsLoaded = true;
            this.onRun();
        }
    }

    onRun = () => {
        const query = this.makeQuery();
        this.sendQuery(query);
        this.setState({ query });
    };

    static contextType = MainContext;

    sendQuery = async (query) => {
        try {
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

    setError = error => {
        this.setState({ error: error.message });
    };

    updateWhere = filter => {
        this.where = {
            ...this.where,
            ...filter
        };
    };

    renderSettings = () => {
        return (
            <div className={css.settings}>
                {this.renderAutoloading()}
                {this.renderHiddenColumns()}
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
        const checked = event.target.checked;
        this.autoloadingTimeoutRef.current.disabled = !checked;
        this.setState({ autoloadingToggle: checked });

        if (checked) {
            this.runPolling();
        } else {
            clearTimeout(this.timeoutId);
        }
    };

    runPolling = () => {
        this.timeoutId = setTimeout(() => {
            this.onRun();
            this.runPolling();
        }, this.state.autoloadingTimeout);
    };

    setAutoloaingTimeout = event => {
        this.setState({ autoloadingTimeout: event.target.value });
    };

    renderHiddenColumns = () => {
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

    toggleHiddenColumn = (event, fieldName) => {
        const newHiddenColumns = {
            ...this.state.hiddenColumns,
            [fieldName]: event.target.checked
        };
        this.setState({ hiddenColumns: newHiddenColumns });
    };

    renderCurrentQuery = () => {
        const { query } = this.state;

        return (
            <div className={css.currentQuery}>
                <Dropdown
                    classNameHeader={css.currentQuery__title}
                    header={<div>Current Query</div>}
                >
                    <div className={css.currentQuery__body}>
                        {query}
                    </div>
                </Dropdown>
            </div>
        );
    };

    renderDbSettings = () => {
        const { clusters, clustersStatuses } = this.context;
        const { limitCount } = this.state;

        return (
            <div>
                <div className={css.dbSettings__limit}>
                    <Dropdown
                        classNameHeader={css.limit__title}
                        header={<div>Limit</div>}
                    >
                        <input
                            className={css.limit__input}
                            type="number"
                            value={limitCount}
                            onChange={this.setLimit}
                        />
                    </Dropdown>
                </div>
                <div className={css.dbSettings__clusters}>
                    <Dropdown
                        classNameHeader={css.clusters__title}
                        header={<div>Connection</div>}
                    >
                        <div className={css.clusters__radiobuttons}>
                            {clusters.map((cluster, index) => (
                                <label
                                    className={css.cluster}
                                    key={index}
                                >
                                    <input
                                        name="cluster"
                                        type="radio"
                                        className={css.claster__input}
                                        defaultChecked={index === 0}
                                        data-cluster-index={index}
                                        onChange={this.setCluster}
                                    />
                                    <ClusterDescription
                                        status={clustersStatuses[index]}
                                        host={cluster.host_name}
                                        port={cluster.port}
                                        user={cluster.user}
                                    />
                                </label>
                            ))}
                        </div>
                    </Dropdown>
                </div>
                <button
                    className={classNames(css.button, css.dbSettings__button)}
                    onClick={this.onRun}
                >
                    Run
                </button>
            </div>
        );
    };

    setCluster = event => {
        const index = parseInt(event.target.dataset.clusterIndex);
        this.setState({ clusterIndex: index });
    };

    setLimit = event => {
        this.setState({ limitCount: event.target.value });
    };

    makeQuery = () => {
        const { connections, connectionIndex, clusters } = this.context;
        const { tableName } = this.props;
        const { limitCount, clusterIndex } = this.state;

        const connection = connections[connectionIndex];
        const cluster = clusters[clusterIndex];
        const conditions = Object.values(this.where).join(' and\n');
        const { host_name: otherHost, port: otherPort } = cluster;
        const { user, password } = connection;

        const first = `select * from
remote('${otherHost}:${otherPort}', system.${tableName}, '${user}', '${password}')\n`;
        const second = conditions ? `where ${conditions}\n` : '';
        const three = `limit ${limitCount}`;

        return [first, second, three].join('');
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
        const { connectionIndex, connectionsStatuses, clusters } = this.context;
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

        if (!logs || !clusters) {
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
}

Logs.propTypes = {
    tableName: PropTypes.string.isRequired
};

export default Logs;
