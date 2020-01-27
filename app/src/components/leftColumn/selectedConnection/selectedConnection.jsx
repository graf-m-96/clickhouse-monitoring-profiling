import React from 'react';
import classNames from 'classnames';

import HostStatus from '../../status/hostStatus';

import { MainContext } from '../../../contexts';

import css from './selectedConnection.css';

class SelectedConnection extends React.Component {
    static contextType = MainContext;

    render() {
        const { connectionIndex, connections, connectionsStatuses } = this.context;

        if (connectionIndex === undefined) {
            return (
                <div className={classNames(css.container, css.weight)}>
                    Connection is not selected
                </div>
            );
        }

        const connection = connections[connectionIndex];
        const status = connectionsStatuses[connectionIndex];

        return (
            <div className={css.container}>
                <div className={classNames(css.field, css.weight)}>
                    Current connection:
                </div>
                <div className={css.field}>{connection.connectionName}</div>
                <div className={css.field}>{connection.host}</div>
                <div className={css.field}>{connection.port}</div>
                <div className={css.field}>{connection.user}</div>
                <HostStatus status={status} />
            </div>
        );
    }
}

export default SelectedConnection;
