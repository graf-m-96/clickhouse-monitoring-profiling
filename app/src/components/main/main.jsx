import React from 'react';

import LeftColumn from '../leftColumn/leftColumn';
import Connections from '../rightColumn/connections/connections';
import Hosts from '../rightColumn/hosts/hosts';
import Logs from '../rightColumn/logs/logs';
import Check from '../check/check';
import Pinging from '../pinging/pinging';
import { MainContext } from '../../contexts';
import { hostStatuses } from '../../constans';

import css from './main.css';

const menuKeyToPage = {
    'Подключения': Connections,
    'Хосты': Hosts,
    'Проверка': Check,
    'Логи': Logs
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

        this.addConnection = this.addConnection.bind(this);
        this.selectConnection = this.selectConnection.bind(this);

        this.state = {
            menuItemIndex: 0,

            connections: defaultConnections,
            connectionsStatuses: Array(defaultConnections.length).fill(hostStatuses.waiting),
            connectionIndex: undefined,
            selectConnection: this.selectConnection,
            addConnection: this.addConnection
        };
    }

    selectMenuItem = index => {
        this.setState({ menuItemIndex: index });
    };

    addConnection(connection) {
        this.setState(state => {
            const newConnections = [...this.state.connections, connection];
            const newConnectionsStatuses = [...this.state.connectionsStatuses, hostStatuses.waiting];

            return {
                ...state,
                connections: newConnections,
                connectionsStatuses: newConnectionsStatuses
            };
        });
    }

    selectConnection(index) {
        this.setState({ connectionIndex: index });
    }

    render() {
        const { menuItemIndex, connectionIndex } = this.state;
        const pageName = menuItems[menuItemIndex];
        const rightColumn = React.createElement(menuKeyToPage[pageName], { pageName });

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
