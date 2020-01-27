import React from 'react';
import classNames from 'classnames';
import Popup from 'reactjs-popup';

import Plus from '../../../public/icons/plus-sign.svg';
import { connectionFields, connectionFieldsInOrder } from '../../../constans';
import { MainContext } from '../../../contexts';
import HostStatus from '../../status/hostStatus';

import css from './connections.css';

const modalStyles = {
    contentStyle: {
        width: '620px',
        height: '394px',
        padding: '0',
        borderRadius: '5px',
        border: 'none'
    },
    overlayStyle: {
        background: 'rgba(0, 0, 0, 0.25)'
    }
};

class Connections extends React.Component {
    static contextType = MainContext;

    constructor(props, context) {
        super(props, context);
        this.formRef = React.createRef();
    }

    renderPopup = (close) => {
        return (
            <div className={css.popup}>
                <div className={css.popup__title}>Adding connection</div>
                <div ref={this.formRef}>
                    <div
                        className={css.form__field}
                        key={-1}
                    >
                        <div className={css.field__name}>protocol</div>
                        <select
                            className={classNames(css.field__input, css.field__select)}
                            name="protocol"
                            defaultValue="https"
                        >
                            <option>https</option>
                            <option>http</option>
                        </select>
                    </div>
                    {connectionFieldsInOrder.map((field, index) => (
                        <div
                            className={css.form__field}
                            key={index}
                        >
                            <div className={css.field__name}>{field}</div>
                            <input
                                className={css.field__input}
                                name={field}
                            />
                        </div>
                    ))}
                    <div className={css.form__buttons}>
                        <button
                            className={classNames(css.button, css.button__defaultSize, css.buttonCancel)}
                            onClick={close}
                        >
                            Cancel
                        </button>
                        <button
                            className={classNames(css.button, css.button__defaultSize, css.buttonSave)}
                            onClick={this.addConnection}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    addConnection = () => {
        const form = this.formRef.current;

        if (!form) {
            return null;
        }

        const inputs = form.querySelectorAll('input');
        const connection = [].reduce.call(inputs, (acc, input) => {
            return {
                ...acc,
                [input.name]: input.value
            };
        }, {});

        this.context.addConnection(connection);
        this.clearForm(inputs);
        this.forceUpdate();
    };

    clearForm = inputs => {
        [].forEach.call(inputs, input => {
            input.value = '';
        });
    };

    renderConnections = () => {
        const { connectionsStatuses } = this.context;

        return (
            <div className={css.table}>
                <div className={css.connectionHeader}>
                    <div className={css.box}>
                        {connectionFieldsInOrder.map((field, index) => (
                            <div
                                className={css.connectionElement}
                                key={index}
                            >
                                {field}
                            </div>
                        ))}
                        <div
                            className={css.connectionElement}
                            key={connectionFieldsInOrder.length + 1}
                        >
                            status
                        </div>
                    </div>
                </div>
                {this.context.connections.map((connection, indexConnection) => (
                    <div
                        key={indexConnection}
                        className={classNames(
                            css.connectionLine,
                            this.context.connectionIndex === indexConnection && css.selectedConnectionLine
                        )}
                        onClick={() => this.selectConnection(indexConnection)}
                    >
                        <div className={css.box}>
                            {Object.keys(connectionFields).map((field, index) => (
                                <div
                                    className={css.connectionElement}
                                    key={index}
                                >
                                    {connection[field]}
                                </div>
                            ))}
                            <div
                                className={css.connectionElement}
                                key={Object.keys(connectionFields).length + 1}
                            >
                                <HostStatus status={connectionsStatuses[indexConnection]} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    selectConnection = index => {
        this.context.selectConnection(index);
    };

    renderMenu = () => {
        return (
            <div className={css.menu}>
                <button className={classNames(css.button, css.buttonAdd)}>
                    <Plus className={css.buttonAddPlus} />
                    Add connection
                </button>
            </div>
        )
    };

    render() {
        return (
            <div>
                <Popup
                    trigger={this.renderMenu()}
                    modal
                    closeOnDocumentClick
                    lockScroll
                    className={css.popup}
                    overlayStyle={modalStyles.overlayStyle}
                    contentStyle={modalStyles.contentStyle}
                >
                    {close => this.renderPopup(close)}
                </Popup>
                {this.renderConnections()}
            </div>
        );
    }
}

export default Connections;
