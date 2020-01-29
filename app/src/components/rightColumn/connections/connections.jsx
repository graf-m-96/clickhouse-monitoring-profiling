import React from 'react';
import classNames from 'classnames';
import Popup from 'reactjs-popup';

import Plus from '../../../public/icons/plus-sign.svg';
import Delete from '../../../public/icons/delete.svg';
import { connectionInputs, connectionInputsInOrder } from '../../../constans';
import { MainContext } from '../../../contexts';
import HostStatus from '../../hostsStatus/hostStatus';

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
                            className={classNames(css.field__data, css.field__input, css.field__select)}
                            name="protocol"
                            defaultValue="https"
                        >
                            <option>https</option>
                            <option>http</option>
                        </select>
                    </div>
                    {connectionInputsInOrder.map((field, index) => (
                        <div
                            className={css.form__field}
                            key={index}
                        >
                            <div className={css.field__name}>{field}</div>
                            <input
                                className={classNames(css.field__data, css.field__input)}
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

        const fields = form.querySelectorAll(`.${css.field__data}`);
        const connection = [].reduce.call(fields, (acc, input) => {
            return {
                ...acc,
                [input.name]: input.value
            };
        }, {});

        this.context.addConnection(connection);
        this.clearForm(fields);
        this.forceUpdate();
    };

    clearForm = fields => {
        [].forEach.call(fields, field => {
            if (field.tagName === 'INPUT') {
                field.value = '';
            }
        });
    };

    renderConnections = () => {
        const { connectionsStatuses } = this.context;

        return (
            <div className={css.table}>
                <div className={css.connectionHeader}>
                    <div className={css.box}>
                        {/* actions */}
                        <div
                            className={classNames(css.connectionElement, css.connectionElement__small)}
                            key={-3}
                        />
                        <div
                            className={classNames(css.connectionElement, css.connectionElement__big)}
                            key={-2}
                        >
                            status
                        </div>
                        <div
                            className={css.connectionElement}
                            key={-1}
                        >
                            protocol
                        </div>
                        {connectionInputsInOrder.map((field, index) => (
                            <div
                                className={css.connectionElement}
                                key={index}
                            >
                                {field}
                            </div>
                        ))}
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
                            <div
                                className={classNames(css.connectionElement, css.connectionElement__small)}
                                key={-3}
                                onClick={event => this.deleteConnection(event, indexConnection)}
                            >
                                <Delete className={css.buttonDelete} />
                            </div>
                            <div
                                className={classNames(css.connectionElement, css.connectionElement__big)}
                                key={-2}
                            >
                                <HostStatus status={connectionsStatuses[indexConnection]} />
                            </div>
                            <div
                                className={css.connectionElement}
                                key={-1}
                            >
                                {connection.protocol}
                            </div>
                            {Object.keys(connectionInputs).map((field, index) => (
                                <div
                                    className={css.connectionElement}
                                    key={index}
                                >
                                    {connection[field]}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    deleteConnection = (event, index) => {
        event.stopPropagation();
        this.context.deleteConnection(index);
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
        );
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
