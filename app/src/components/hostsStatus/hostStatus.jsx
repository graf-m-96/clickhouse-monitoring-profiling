import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { MainContext } from '../../contexts';
import { hostStatuses } from '../../constans';

import css from './hostsStatus.css';

class HostStatus extends React.Component {
    static contextType = MainContext;

    render() {
        const { status, hiddenText, className } = this.props;

        return (
            <div className={classNames(css.container, css[status], className)}>
                <div className={css.square} />
                {!hiddenText && (
                    <div className={css.text}>
                        {status}
                    </div>
                )}
            </div>
        );
    }
}

HostStatus.propTypes = {
    status: PropTypes.oneOf(Object.keys(hostStatuses)).isRequired,
    hiddenText: PropTypes.bool,
    className: PropTypes.string
};

export default HostStatus;
