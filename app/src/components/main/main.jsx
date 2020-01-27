import React from 'react';

import LeftColumn from '../leftColumn/leftColumn';
import Connections from '../rightColumn/connections/connections';
import Hosts from '../rightColumn/hosts/hosts';
import QueryLog from '../rightColumn/queryLog/queryLog';
import Pinging from '../pinging/pinging';
import { MainContext } from '../../contexts';
import { hostStatuses } from '../../constans';
import calculateScrollWidth from '../../lib/calculateScrollWidth';

import css from './main.css';

const menuKeyToPage = {
    'connections': Connections,
    'clusters': Hosts,
    'query log': QueryLog
};
const menuItems = Object.keys(menuKeyToPage);

const defaultConnections = [
    {
        connectionName: 'default',
        host: '127.0.0.1',
        port: '8123',
        user: 'default',
        password: '1'
    },
    {
        connectionName: 'first',
        host: '127.0.0.1',
        port: '8124',
        user: 'default',
        password: '1'
    },
    {
        connectionName: 'second',
        host: 'localhost',
        port: '8125',
        user: 'default',
        password: '1'
    }
];

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuItemIndex: 0,
            // menuItemIndex: 2,

            connections: defaultConnections,
            connectionsStatuses: Array(defaultConnections.length).fill(hostStatuses.waiting),
            connectionIndex: undefined,
            // connectionIndex: 0,
            selectConnection: this.selectConnection,
            addConnection: this.addConnection,
            deleteConnection: this.deleteConnection,
            updateConnectionStatus: this.updateConnectionStatus,

            hostsColumns: undefined,
            hosts: undefined,
            hostsStatuses: undefined,
            setHosts: this.setHosts,
            updateHostsStatuses: this.updateHostsStatuses,

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

            return {
                ...state,
                connections: newConnections,
                connectionsStatuses: newConnectionsStatuses,
                connectionIndex
            }
        });
        if (isCurrentConnection) {
            this.setState({ connectionIndex: undefined });
            this.deleteHosts(index);
        }
    };

    setHosts = ({ hostsColumns, hosts, hostsStatuses }) => {
        this.setState({
            hostsColumns,
            hosts,
            hostsStatuses
        })
    };

    updateHostsStatuses = hostsStatuses => {
        this.setState({ hostsStatuses });
    };

    deleteHosts = () => {
        this.setState({
            hostsColumns: undefined,
            hosts: undefined,
            hostsStatuses: undefined
        });
    };

    selectConnection = index => {
        this.setState({ connectionIndex: index });
        this.deleteHosts();
    };

    updateConnectionStatus = statuses => {
        this.setState({ connectionsStatuses: statuses });
    };

    componentDidMount() {
        const scrollWidth = calculateScrollWidth();

        this.setState({ scrollWidth });
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
