import React from 'react';

import LeftColumn from '../leftColumn/leftColumn';
import Connections from '../rightColumn/connections/connections';
import Clusters from '../rightColumn/clusters/clusters';
import QueryLog from '../rightColumn/queryLog';
import QueryThreadLog from '../rightColumn/queryThreadLog';
import Pinging from '../pinging/pinging';
import { MainContext } from '../../contexts';
import { hostStatuses } from '../../constans';
import calculateScrollWidth from '../../lib/calculateScrollWidth';
import { getConnections, saveConnections } from '../../lib/storage';
import QueriesListPage from '../rightColumn/queriesListPage/queriesListPage';
import Graphics from '../rightColumn/graphics/graphics';

import css from './main.css';

const menuKeyToPage = {
    'connections': Connections,
    'clusters': Clusters,
    'query_log': QueryLog,
    'query_thread_log': QueryThreadLog,
    'queries list': QueriesListPage,
    'graphics': Graphics
};
const menuItems = Object.keys(menuKeyToPage);

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuItemIndex: 0,

            connections: [],
            connectionsStatuses: [],
            connectionIndex: undefined,
            selectConnection: this.selectConnection,
            addConnection: this.addConnection,
            deleteConnection: this.deleteConnection,
            updateConnectionStatus: this.updateConnectionStatus,

            clustersColumns: undefined,
            clusters: undefined,
            clustersStatuses: undefined,
            setClusters: this.setClusters,
            updateClustersStatuses: this.updateClustersStatuses,

            metrics: [],
            updateMetrics: this.updateMetrics,

            scrollWidth: 0
        };
    }

    selectMenuItem = index => {
        this.setState({ menuItemIndex: index });
    };

    addConnection = connection => {
        this.setState(state => {
            const newConnections = [...this.state.connections, connection];
            const newConnectionsStatuses = [...this.state.connectionsStatuses, hostStatuses.waiting];

            saveConnections(newConnections);

            return {
                ...state,
                connections: newConnections,
                connectionsStatuses: newConnectionsStatuses
            };
        });
    };

    deleteConnection = index => {
        const isCurrentConnection = index === this.state.connectionIndex;
        this.setState(state => {
            const newConnections = [...this.state.connections];
            newConnections.splice(index, 1);
            const newConnectionsStatuses = [...this.state.connectionsStatuses];
            newConnectionsStatuses.splice(index, 1);

            saveConnections(newConnections);

            return {
                ...state,
                connections: newConnections,
                connectionsStatuses: newConnectionsStatuses
            };
        });
        if (isCurrentConnection) {
            this.setState({ connectionIndex: undefined });
            this.clearClusters(index);
        }
    };

    setClusters = ({ clustersColumns, clusters, clustersStatuses }) => {
        this.setState({
            clustersColumns,
            clusters,
            clustersStatuses
        });
    };

    updateClustersStatuses = clustersStatuses => {
        this.setState({ clustersStatuses });
    };

    clearClusters = () => {
        this.setState({
            clustersColumns: undefined,
            clusters: undefined,
            clustersStatuses: undefined
        });
    };

    selectConnection = index => {
        this.setState({ connectionIndex: index });
        this.clearClusters();
        this.clearMetrics();
    };

    updateConnectionStatus = statuses => {
        this.setState({ connectionsStatuses: statuses });
    };

    updateMetrics = metrics => {
        this.setState({ metrics });
    };

    clearMetrics = () => {
        this.setState({ metrics: [] });
    };

    componentDidMount() {
        const scrollWidth = calculateScrollWidth();
        const defaultConnections = getConnections();

        this.setState({
            scrollWidth,
            connections: defaultConnections,
            connectionsStatuses: Array(defaultConnections.length).fill(hostStatuses.waiting)
        });
    }

    render() {
        const { menuItemIndex, connectionIndex } = this.state;
        const pageName = menuItems[menuItemIndex];
        const rightColumn = React.createElement(menuKeyToPage[pageName]);

        return (
            <MainContext.Provider value={this.state}>
                <Pinging />
                <div className={css.container}>
                    <div className={css.leftColumn}>
                        <LeftColumn
                            menuItems={menuItems}
                            menuItemIndex={this.state.menuItemIndex}
                            selectMenuItem={this.selectMenuItem}
                            connectionIndex={connectionIndex}
                        />
                    </div>
                    <div className={css.rightColumn}>
                        {rightColumn}
                    </div>
                </div>
            </MainContext.Provider>
        );
    }
}

export default Main;
