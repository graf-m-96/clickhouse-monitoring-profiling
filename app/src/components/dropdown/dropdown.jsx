import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Up from '../../public/icons/arrowUp.svg';
import Down from '../../public/icons/arrowDown.svg';

import css from './dropdown.css';


class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open || this.props.open === undefined
        };
    }

    toggle = () => {
        this.setState({ open: !this.state.open });
    }

    render() {
        const { header, classNameHeader, children } = this.props;
        const { open } = this.state;
        const icon = React.createElement(open ? Down : Up,
            { width: '14px', height: '14px', className: css.icon }
        );

        return (
            <>
                <div
                    className={classNames(css.title, classNameHeader)}
                    onClick={this.toggle}
                >
                    {icon}
                    {header}
                </div>
                {open && children}
            </>
        );
    }
}

Dropdown.propTypes = {
    header: PropTypes.object.isRequired,
    classNameHeader: PropTypes.string,
    open: PropTypes.bool,
    children: PropTypes.any
};

export default Dropdown;
