import React from 'react';

import LeftMenu from "../leftMenu/leftMenu";
import Connections from "../content/connections/connections";
import Hosts from "../content/hosts/hosts";
import Logs from "../content/logs/logs";
import {MainContext} from '../../contexts';

import css from "./main.css";

const menuKeyToPage = {
    'Подключения': Connections,
    'Хосты': Hosts,
    'Логи': Logs
};
const menuItems = Object.keys(menuKeyToPage);

const defaultConnections = [
    {
        connectionName: "default",
        host: "127.0.0.1",
        port: "8123",
        user: "default",
        password: "1"
    },
    {
        connectionName: "first",
        host: "127.0.0.1",
        port: "8124",
        user: "default",
        password: "1"
    },
    {
        connectionName: "second",
        host: "localhost",
        port: "8125",
        user: "default",
        password: "1"
    },
];

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.addConnection = this.addConnection.bind(this);
        this.selectConnection = this.selectConnection.bind(this);

        this.state = {
            menuItemIndex: 0,
            connections: defaultConnections,
            connectionIndex: undefined,
            addConnection: this.addConnection,
            selectConnection: this.selectConnection
        };
    }

    addConnection(connection) {
        this.setState(state => {
            const newConnections = [...this.state.connections, connection];

            return {
                ...state,
                connections: newConnections
            }
        });
    }

    selectConnection(index) {
        this.setState(state => {
            return {
                ...state,
                connectionIndex: index
            }
        });
    }

    setMenuItem = index => {
        this.setState({ menuItemIndex: index });
    };

    render() {
        const { menuItemIndex, connectionIndex } = this.state;
        const pageName = menuItems[menuItemIndex];
        const content = React.createElement(menuKeyToPage[pageName], { pageName });

        return (
            <MainContext.Provider value={this.state}>
                <div className={css.container}>
                    <div className={css.leftMenu}>
                        <LeftMenu
                            menuItems={menuItems}
                            menuItemIndex={this.state.menuItemIndex}
                            setMenuItem={this.setMenuItem}
                            connectionIndex={connectionIndex}
                        />
                    </div>
                    <div className={css.content}>
                        {content}
                    </div>
                </div>
            </MainContext.Provider>
        );
    }
}

export default Main;
