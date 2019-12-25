import React from 'react';
import PropTypes from "prop-types";
import classNames from 'classnames';
import Popup from "reactjs-popup";

import Title from "../header/contentHeader";
import Plus from '../../../public/icons/plus-sign.svg';
import { connectionFields, connectionInOrder } from '../../../constans';
import {MainContext} from "../../../contexts";
import WatchedStatus from "./watchedStatus/watchedStatus";

import css from './connections.css';

const modalStyles = {
    contentStyle: {
        width: '620px',
        height: '352px',
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
                <div className={css.popup__title}>Добавление подключения</div>
                <div ref={this.formRef}>
                    {connectionInOrder.map(field => (
                        <div className={css.form__field}>
                            <div className={css.field__name}>{connectionFields[field]}</div>
                            <input
                                className={css.field__input}
                                name={field}
                            />
                        </div>
                    ))}
                    <div className={css.form__buttons}>
                        <button
                            className={classNames(css.button, css.buttonCancel)}
                            onClick={close}
                        >
                            Отменить
                        </button>
                        <button
                            className={classNames(css.button, css.buttonSave)}
                            onClick={this.addConnection}
                        >
                            Добавить
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    addConnection = () => {
        const form = this.formRef.current;

        if (!form) {

            return;
        }

        const inputs = form.querySelectorAll('input');
        const connection = [].reduce.call(inputs, (acc, input) => {
            return {
                ...acc,
                [input.name]: input.value
            }
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
        return (
            <div>
                <div className={css.connectionHeader}>
                    <div className={css.box}>
                        {connectionInOrder.map((field, index) => (
                            <div
                                className={css.connectionElement}
                                key={index}
                                title={field}
                            >
                                {field}
                            </div>
                        ))}
                        <div
                            className={css.connectionElement}
                            key={connectionInOrder.length + 1}
                            title="status"
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
                                    title={connection[field]}
                                >
                                    {connection[field]}
                                </div>
                            ))}
                            <div
                                className={css.connectionElement}
                                key={Object.keys(connectionFields).length + 1}
                                title="status"
                            >
                                <WatchedStatus connectionIndex={indexConnection} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    selectConnection = index => {
        this.context.selectConnection(index);
        this.forceUpdate();
    };

    render() {
        const { pageName } = this.props;

        return (
            <div>
                <Title pageName={pageName}>
                    <Popup
                        trigger={(
                            <button className={css.add}>
                                <Plus className={css.add__plus} />
                                Добавить
                            </button>
                        )}
                        modal
                        closeOnDocumentClick
                        lockScroll
                        className={css.popup}
                        overlayStyle={modalStyles.overlayStyle}
                        contentStyle={modalStyles.contentStyle}
                    >
                        {close => this.renderPopup(close)}
                    </Popup>
                </Title>
                {this.renderConnections()}
            </div>
        );
    }
}

Connections.propTypes = {
    pageName: PropTypes.string.isRequired
};

export default Connections;
