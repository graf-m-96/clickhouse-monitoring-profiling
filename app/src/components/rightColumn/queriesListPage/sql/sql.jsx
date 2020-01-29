import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Dropdown from '../../../dropdown/dropdown';

import css from './sql.css';

class Sql extends React.Component {
    constructor(props) {
        super(props);
        this.textareaRef = React.createRef();
    }

    run = () => {
        const value = this.textareaRef.current.value;
        this.props.onRun(value);
    };

    save = () => {
        const value = this.textareaRef.current.value;
        this.props.onSave(value);
    };

    render() {
        return (
            <div className={css.root}>
                <Dropdown
                    classNameHeader={css.title}
                    header={<div>New SQL</div>}
                >
                    <textarea
                        className={css.textarea}
                        ref={this.textareaRef}
                    />
                    <div className={css.buttons}>
                        <button
                            className={classNames(css.button, css.button__run)}
                            onClick={this.run}
                        >
                            Run
                        </button>
                        <button
                            className={css.button}
                            onClick={this.save}
                        >
                            Save
                        </button>
                    </div>
                </Dropdown>
            </div>
        );
    }
}

Sql.propTypes = {
    onRun: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};


export default Sql;
