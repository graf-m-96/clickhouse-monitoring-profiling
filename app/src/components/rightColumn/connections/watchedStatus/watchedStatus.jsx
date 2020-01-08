import React from 'react';
import PropTypes from "prop-types";

import HostStatus from "../../../status/hostStatus";

import {hostStatuses, answerToHostStatus} from '../../../../constans';
import ApiManager from '../../../../lib/requests';
import {MainContext} from "../../../../contexts";

const timeout = 2000;

class WatchedStatus extends React.Component {
    static contextType = MainContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            status: hostStatuses.waiting
        }
    }

    componentDidMount() {
        this.runPolling();
    }

    runPolling() {
        const {connections} = this.context;
        const {connectionIndex} = this.props;
        const connection = connections[connectionIndex];

        setInterval(async () => {
            const answer = await ApiManager.ping(connection);
            const status = answer in answerToHostStatus ? answerToHostStatus[answer] : hostStatuses.unachievable;

            this.setState({status});
        }, timeout);
    }

    render() {
        const {status} = this.state;

        return (
            <HostStatus status={status} />
        );
    }
}

WatchedStatus.propTypes = {
    connectionIndex: PropTypes.number.isRequired
};

export default WatchedStatus;
