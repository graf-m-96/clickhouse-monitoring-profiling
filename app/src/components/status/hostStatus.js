import React from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

import {MainContext} from "../../contexts";
import {hostStatuses} from '../../constans';

import css from './status.css';

class HostStatus extends React.Component {
    static contextType = MainContext;

    render() {
        const { status } = this.props;

        return (
            <div className={classNames(css.container, css[status])}>
                <div className={css.square} />
                <div>{status}</div>
            </div>
        );
    }
}

HostStatus.propTypes = {
    status: PropTypes.oneOf(Object.keys(hostStatuses)).isRequired
};

export default HostStatus;
