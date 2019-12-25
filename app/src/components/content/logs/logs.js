import React from 'react';
import PropTypes from "prop-types";

import Title from "../header/contentHeader";
import {MainContext} from "../../../contexts";
import ApiManager from "../../../lib/requests";

import css from './logs.css';

const timeout = 20000;

class Logs extends React.Component {
    static contextType = MainContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            error: false,
            table: undefined
        }
    }

    componentDidMount() {
        this.runPolling();
    }

    runPolling() {
        setInterval(async () => {
            try {
                const answer = await ApiManager.getQueryLogs(this.context.connections[this.context.connectionIndex]);
                this.setState({ table: answer, error: false });
            } catch (e) {
                this.setState({ error: e.message });
            }
        }, timeout);
    }

    renderTable = () => {
        const { table } = this.state;

        if (!table) {
            return null;
        }

        return (
            <div>
                <div className={css.connectionHeader}>
                    <div className={css.box}>
                        {table.meta.map((field, index) => (
                            <div
                                className={css.connectionElement}
                                key={index}
                                title={field.name}
                            >
                                {field.name}
                            </div>
                        ))}
                    </div>
                </div>
                {table.data.slice(0, 10).map((line, indexLine) => (
                    <div
                        key={indexLine}
                        className={css.connectionLine}
                    >
                        <div className={css.box}>
                            {Object.values(line).map((field, index) => (
                                <div
                                    className={css.connectionElement}
                                    key={index}
                                    title={field}
                                >
                                    {field}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    };

    render() {
        const { pageName } = this.props;
        const { error } = this.state;

        if (error) {
            return (
                <div>
                    <Title pageName={pageName} />
                    <div className={css.errorMessage}>
                        При получении кластеров произошла ошибка: {error}
                    </div>
                </div>
            )
        }

        return (
            <div>
                <Title pageName={pageName} />
                {this.renderTable()}
            </div>
        );
    }
}

Logs.propTypes = {
    pageName: PropTypes.string.isRequired
};

export default Logs;
