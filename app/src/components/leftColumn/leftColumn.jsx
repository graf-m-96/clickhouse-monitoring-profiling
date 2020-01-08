import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SelectedConnection from './selectedConnection/selectedConnection';

import css from './leftColumn.css';

class LeftColumn extends React.Component {
    render() {
        const { menuItems, menuItemIndex, selectMenuItem, connectionIndex } = this.props;

        return (
            <>
                <SelectedConnection connectionIndex={connectionIndex} />
                {menuItems.map((menuItem, index) => (
                    <div
                        className={classNames(css.menuItem, menuItemIndex === index && css.menuItem_selected)}
                        onClick={() => selectMenuItem(index)}
                        key={index}
                    >
                        {menuItem}
                    </div>
                ))}
            </>
        );
    }
}

LeftColumn.propTypes = {
    menuItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    menuItemIndex: PropTypes.number.isRequired,
    selectMenuItem: PropTypes.func.isRequired,
    connectionIndex: PropTypes.number
};

export default LeftColumn;
