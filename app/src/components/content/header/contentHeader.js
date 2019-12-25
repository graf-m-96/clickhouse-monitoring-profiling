import React from 'react';
import PropTypes from "prop-types";

import css from './contentHeader.css';

class ContentHeader extends React.Component {
    render() {
        const { pageName, children } = this.props;

        return (
            <div className={css.contentHeader}>
                <div className={css.title}>
                    {pageName}
                </div>
                {children}
            </div>
        );
    }
}

ContentHeader.propTypes = {
    pageName: PropTypes.string.isRequired
};

export default ContentHeader;
