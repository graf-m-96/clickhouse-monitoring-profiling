import React from 'react';
import classNames from 'classnames';

import HostStatus from "../../status/hostStatus";

import {MainContext} from "../../../contexts";
import {hostStatuses, answerToHostStatus} from '../../../constans';
import ApiManager from '../../../lib/requests';

import css from './selectedConnection.css';
import PropTypes from "prop-types";

const timeout = 1000;

class SelectedConnection extends React.Component {
    static contextType = MainContext;
    lock = false;

    constructor(props, context) {
        super(props, context);
        this.state = {
            status: hostStatuses.waiting
        }
    }

    componentDidMount() {
        this.runPolling();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.connectionIndex !== this.props.connectionIndex) {
            this.lock = true;
            this.setState({ status: hostStatuses.waiting });
            setTimeout(() => {
                this.lock = false
            }, timeout);
        }
    }

    runPolling() {
        setInterval(async () => {
            const answer = await ApiManager.ping(this.context.connections[this.context.connectionIndex]);
            const status = answer in answerToHostStatus ? answerToHostStatus[answer] : hostStatuses.unachievable;

            if (!this.lock) {
                this.setState({ status });
            }
        }, timeout);
    }

    render() {
        const { connectionIndex, connections } = this.context;
        const { status } = this.state;

        if (connectionIndex === undefined) {
            return (
                <div className={classNames(css.container, css.weight)}>
                    Соединение не выбрано
                </div>
            );
        }

        const connection = connections[connectionIndex];

        return (
            <div className={css.container}>
                <div className={classNames(css.field, css.weight)}>
                    Текущее соединение:
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

SelectedConnection.propTypes = {
    connectionIndex: PropTypes.number
};

export default SelectedConnection;
