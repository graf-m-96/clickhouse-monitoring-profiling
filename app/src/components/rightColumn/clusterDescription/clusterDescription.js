import React from 'react';
import PropTypes from 'prop-types';

import HostStatus from '../../hostsStatus/hostStatus';

import css from './clusterDescription.css';

class ClusterDescription extends React.Component {
    render() {
        const { status, host, port, user } = this.props;

        return (
            <div className={css.root}>
                <HostStatus
                    status={status}
                    hiddenText
                    className={css.status}
                />
                <div className={css.address}>
                    {host}:{port}
                </div>
                <div className={css.user}>
                    {user}
                </div>
            </div>
        );
    }
}

ClusterDescription.propTypes = {
    status: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    port: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    user: PropTypes.string.isRequired
};

export default ClusterDescription;
