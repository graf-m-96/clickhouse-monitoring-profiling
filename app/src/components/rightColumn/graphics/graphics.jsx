import React from 'react';

import { LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts';

import { MainContext } from '../../../contexts';
import ApiManager from '../../../lib/requests';
import { hostStatuses } from '../../../constans';

import css from './graphics.css';

const queryForMetrics = 'select * from system.metrics';

class Graphics extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = {
            interval: 1,
            error: undefined
        };
    }

    componentDidMount() {
        this.clusterIsLoaded = this.context.clusters !== undefined;

        if (this.clusterIsLoaded) {
            this.runPolling();
        }
    }

    componentDidUpdate() {
        if (!this.clusterIsLoaded && this.context.clusters !== undefined) {
            this.clusterIsLoaded = true;
            this.runPolling();
        }
    }

    runPolling = async () => {
    //     try {
    //         const { connections, connectionIndex } = this.context;
    //         const connection = connections[connectionIndex];
    //         const logs = await ApiManager.sendQuery(connection, queryForMetrics);
    //         console.log('logs: ', logs);
    //         this.setLogs(logs);
    //     } catch (error) {
    //         console.log('error: ', error);
    //         this.setError(error);
    //     }
    };

    // setLogs = logs => {
    //     const { columns, data } = this.prepareAnswer(logs);
    //     this.setState({ logs, columns, data, error: false });
    // };

    // setError = error => {
    //     this.setState({ error: error.message });
    // };

    renderMain = () => {
        return (
            <div className={css.root}>
                <div className={css.query__title}>
                    <div className={css.title__main}>Query </div>
                    <div className={css.title__description}>(average number of executing queries)</div>
                </div>
                <div className={css.time}>
                    <select
                        className={css.select}
                        onChange={this.onChangeSelect}
                    >
                        <option value="1">1 hour</option>
                        <option value="2">2 hours</option>
                        <option value="6">6 hours</option>
                        <option value="24">1 day</option>
                    </select>
                </div>
                {this.renderGraphic()}
            </div>
        )
    };

    renderGraphic = () => {
        const data = [
            { name: 'Page A', uv: 1000, pv: 2400 },
            { name: 'Page B', uv: 300, pv: 4567 },
            { name: 'Page C', uv: 280, pv: 1398 },
            { name: 'Page D', uv: 200, pv: 9800 },
            { name: 'Page E', uv: 278, pv: null },
            { name: 'Page F', uv: 189, pv: 4800 },
            { name: 'Page G', uv: 189, pv: 4800 },
            { name: 'Page H', uv: 189, pv: 4800 },
            { name: 'Page I', uv: 189, pv: 4800 },
            { name: 'Page J', uv: 189, pv: 4800 },
        ];

        return (
            <LineChart
                width={1000}
                height={400}
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <XAxis dataKey="name" />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
                <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
            </LineChart>
        );
    };

    onChangeSelect = event => {
        const interval = event.target.value;
        this.setState({ interval });
    };

    render() {
        const { connectionIndex, connectionsStatuses } = this.context;
        const { error } = this.state;

        if (connectionIndex === undefined) {
            return (
                <div className={css.errorMessage}>
                    Connection is not selected
                </div>
            );
        }

        if (connectionsStatuses[connectionIndex] === hostStatuses.unachievable) {
            return (
                <div className={css.errorMessage}>
                    Connection is not unachievable
                </div>
            );
        }

        if (error) {
            return (
                <div className={css.errorMessage}>
                    {error}
                </div>
            );
        }

        return this.renderMain();
    }
}

export default Graphics;
