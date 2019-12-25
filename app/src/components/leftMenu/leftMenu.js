import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SelectedConnection from "./selectedConnection/selectedConnection";

import css from './leftMenu.css';

class LeftMenu extends React.Component {
    render() {
        const { menuItems, menuItemIndex, setMenuItem, connectionIndex } = this.props;

        return (
            <>
                <SelectedConnection connectionIndex={connectionIndex} />
                {menuItems.map((menuItem, index) => (
                    <div
                        className={classNames(css.menuItem, menuItemIndex === index && css.menuItem_selected)}
                        onClick={() => setMenuItem(index)}
                        key={index}
                    >
                        {menuItem}
                    </div>
                ))}
            </>
        );
    }
}

LeftMenu.propTypes = {
    menuItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    menuItemIndex: PropTypes.number.isRequired,
    setMenuItem: PropTypes.func.isRequired,
    connectionIndex: PropTypes.number
};

export default LeftMenu;
