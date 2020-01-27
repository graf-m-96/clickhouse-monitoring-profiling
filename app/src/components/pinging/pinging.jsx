import React from 'react';

import { MainContext } from '../../contexts';
import ApiManager from '../../lib/requests';
import { answerToHostStatus, hostStatuses } from '../../constans';

const timeout = 1000;

class PingingConnections extends React.Component {
    static contextType = MainContext;
    intervalId;

    componentDidMount() {
        this.runPolling();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    runPolling = () => {
        this.intervalId = setInterval(() => {
            this.runPollingConnections();
            this.runPollingHosts();
        }, timeout);
    };

    runPollingConnections = async () => {
        try {
            const answers = await Promise.all(this.context.connections.map(ApiManager.ping));
            const statuses = answers.map(answer => this.convertAnswerToStatus(answer));
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

    runPollingHosts = async () => {
        try {
            const { connectionIndex, connectionsStatuses, connections } = this.context;

            if (connectionIndex === undefined ||
                connectionsStatuses[connectionIndex] === hostStatuses.unachievable) {
                return null;
            }

            const connection = connections[connectionIndex];
            let hostsColumns, hosts, hostsStatuses;

            // if (this.context.hosts) {
            // { hostsColumns, hosts, hostsStatuses } = this.context;

            // } else {
            //     const answerClusters = await ApiManager.getClusters(connection);
            //     console.log('clusters: ', answerClusters);
            //     this.prepeareClustersAnswer(answerClusters);
            // }
            // const answers = await Promise.all(this.context.connections.map(ApiManager.ping));
            // const statuses = answers.map(answer => this.convertAnswerToStatus(answer));
            // const isOld = statuses.every((status, index) => {
            //     return status === this.context.connectionsStatuses[index];
            // });

            // if (!isOld) {
            //     this.context.updateConnectionStatus(statuses);
            // }
        } catch (e) {
            // ignore
        }
    };

    convertAnswerToStatus = answer => {
        return answer in answerToHostStatus
            ? answerToHostStatus[answer]
            : hostStatuses.unachievable;
    };

    prepeareClustersAnswer = answer => {
        const hostsColumns = answer.meta;
        const hosts = answer.data.map(row => {
            return row.reduce((acc, el, index) => {
                const columnName = hostsColumns[index].name
                acc[columnName] = el;

                return acc;
            }, {});
        });
        const hostsStatuses = Array(hostsColumns.length).fill(hostStatuses.waiting);

        this.context.setHosts({ hostsColumns, hosts, hostsStatuses });

        return { hostsColumns, hosts, hostsStatuses };
    };

    render() {
        return null;
    }
}

export default PingingConnections;
