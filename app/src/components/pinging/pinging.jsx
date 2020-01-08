import React from 'react';

import {MainContext} from "../../contexts";
import {hostStatuses, answerToHostStatus} from '../../constans';
import ApiManager from '../../lib/requests';

import PropTypes from "prop-types";

const timeout = 1000;

class Pinging extends React.Component {
    static contextType = MainContext;
    intervalId;

    componentDidMount() {
        this.runPolling();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    runPolling() {
        this.intervalId = setInterval(async () => {
            const answer = await ApiManager.ping(this.context.connections[this.context.connectionIndex]);
            const status = answer in answerToHostStatus ? answerToHostStatus[answer] : hostStatuses.unachievable;

            if (!this.lock) {
                this.setState({status});
            }
        }, timeout);
    }

    render() {
        return null;
    }
}

Pinging.propTypes = {
    connectionIndex: PropTypes.number
};

export default Pinging;
