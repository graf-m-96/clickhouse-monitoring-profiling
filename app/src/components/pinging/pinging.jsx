import React from 'react';

import { MainContext } from '../../contexts';
import ApiManager from '../../lib/requests';
import { answerToHostStatus, hostStatuses } from '../../constans';

const timeout = 1000;
const timeoutClear = 1000 * 60 * 60 * 24;

class PingingConnections extends React.Component {
    static contextType = MainContext;
    intervalId;
    intervalClearId;

    componentDidMount() {
        this.runPolling();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
        clearInterval(this.intervalClearId);
    }

    runPolling = () => {
        this.intervalId = setInterval(() => {
            this.runPollingConnections();
            this.runPollingClusters();
            this.runPollingMetrics();
        }, timeout);

        this.intervalClearId = setInterval(() => {

        }, timeoutClear);
    };

    clearMetrics = () => {
        const { metrics } = this.context;

        // TODO
    };

    runPollingConnections = async () => {
        try {
            const pings = await Promise.all(this.context.connections.map(ApiManager.ping));
            const statuses = pings.map(this.convertAnswerToStatus);
            const isOld = statuses.every((status, index) => {
                return status === this.context.connectionsStatuses[index];
            });

            if (!isOld) {
                this.context.updateConnectionStatus(statuses);
            }
        } catch (e) {
            // ignore
        }
    };

    runPollingClusters = async () => {
        try {
            const { connectionIndex, connectionsStatuses, connections } = this.context;

            if (connectionIndex === undefined ||
                connectionsStatuses[connectionIndex] === hostStatuses.unachievable) {
                return null;
            }

            const connection = connections[connectionIndex];
            let dataAboutClusters;

            if (this.context.clusters) {
                dataAboutClusters = this.context;
            } else {
                const answerClusters = await ApiManager.getClusters(connection);
                dataAboutClusters = this.prepareClustersAnswer(answerClusters);
            }

            const { clusters, clustersStatuses } = dataAboutClusters;

            const pings = await Promise.all(clusters.map(cluster => {
                const options = {
                    host: connection.host,
                    port: connection.port,
                    user: connection.user,
                    password: connection.password,
                    otherHost: cluster.host_name,
                    otherPort: cluster.port
                };

                return ApiManager.pingRemote(options);
            }));
            const statuses = pings.map(this.convertAnswerToStatus);
            const isOld = statuses.every((status, index) => {
                return status === clustersStatuses[index];
            });

            if (!isOld) {
                this.context.updateClustersStatuses(statuses);
            }
        } catch (e) {
            // ignore
        }
    };

    runPollingMetrics = async () => {
        try {
            const { connectionIndex, connectionsStatuses, connections, clusters } = this.context;

            if (connectionIndex === undefined ||
                connectionsStatuses[connectionIndex] === hostStatuses.unachievable ||
                clusters === undefined) {
                return null;
            }

            const connection = connections[connectionIndex];

            const answers = await Promise.all(clusters.map(cluster => {
                const options = {
                    host: connection.host,
                    port: connection.port,
                    user: connection.user,
                    password: connection.password,
                    otherHost: cluster.host_name,
                    otherPort: cluster.port
                };

                return ApiManager.getMetrics(options);
            }));

            // TODO
        } catch (e) {
            // ignore
        }
    };

    getClusterName = cluster => `${cluster.host_name}:${cluster.port}`;

    convertAnswerToStatus = answer => {
        return answer in answerToHostStatus
            ? answerToHostStatus[answer]
            : hostStatuses.unachievable;
    };

    prepareClustersAnswer = answer => {
        const clustersColumns = answer.meta.map(column => ({
            ...column,
            Header: column.name,
            accessor: column.name
        }));
        const clusters = answer.data.map(row => {
            return row.reduce((acc, el, index) => {
                const columnName = clustersColumns[index].name;
                acc[columnName] = el;

                return acc;
            }, {});
        });
        const extraColumn = 'status';
        clustersColumns.unshift({
            Header: extraColumn,
            accessor: extraColumn,
            name: extraColumn,
            type: ''
        });
        const clustersStatuses = Array(clusters.length).fill(hostStatuses.waiting);

        this.context.setClusters({ clustersColumns, clusters, clustersStatuses });

        return { clustersColumns, clusters, clustersStatuses };
    };

    render() {
        return null;
    }
}

export default PingingConnections;
