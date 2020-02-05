import React from 'react';
import moment from 'moment';

import { LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts';

import { MainContext } from '../../../contexts';
import { hostStatuses } from '../../../constans';

import css from './graphics.css';

const colors = [
    '#37bff2',
    '#169833',
    '#f6ab31',
    '#c95edd',
    '#e85b4e',
    '#409fd4',
    '#7bbf00',
    '#ff2727',
    '#80f320'
];

const getColor = index => colors[index % colors.length];

const intervalToTimeoutInMinutes = {
    1: 2,
    2: 5,
    6: 10,
    24: 30
};
const intervalUpdateGraphicInMs = 15 * 1000;

class Graphics extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = {
            intervalInHours: 1,
            graphic: []
        };
        this.timeoutId = null;
    }

    componentDidMount() {
        this.runUpdated();
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.intervalInHours !== this.state.intervalInHours) {
            clearTimeout(this.timeoutId);
            this.setState({ graphic: [] });
            this.runUpdated();
        }
    }

    runUpdated = () => {
        this.getSplitMetrics();
        this.timeoutId = setTimeout(this.runUpdated, intervalUpdateGraphicInMs);
    }

    getSplitMetrics = () => {
        const { metrics, clusters } = this.context;

        if (this.context.clusters === undefined) {
            return;
        }

        const { intervalInHours } = this.state;
        const step = intervalToTimeoutInMinutes[intervalInHours];
        const startInDate = new Date();
        startInDate.setSeconds(0);
        const start = moment(startInDate);
        start.subtract(intervalInHours, 'hours');

        const graphic = [];

        let current = start;
        let next = moment(current).add(step, 'minutes');
        let sums = Array(clusters.length).fill(0);
        let counts = Array(clusters.length).fill(0);
        metrics.forEach(data => {
            const time = moment(new Date(data.time));

            if (time.isBefore(current)) {
                return;
            }

            if (time.isAfter(next)) {
                this.addMarkToGraphic(graphic, current, sums, counts);
                while (time.isAfter(next)) {
                    current = next;
                    next = moment(current).add(step, 'minutes');
                }
                sums = Array(clusters.length).fill(0);
                counts = Array(clusters.length).fill(0);
            }

            const values = data.values;
            for (let i = 0; i < values.length; i++) {
                if (values[i] !== null) {
                    sums[i] += values[i];
                    counts[i]++;
                }
            }
        });
        this.addMarkToGraphic(graphic, current, sums, counts);

        this.setState({ graphic });
    };

    addMarkToGraphic = (graphic, current, sums, counts) => {
        if (counts.every(count => count === 0)) {
            return;
        }

        const { clusters } = this.context;
        const name = current.format('HH:mm:ss');
        const clusterNameToValue = {};

        clusters.forEach((cluster, index) => {
            const clusterName = this.getClusterName(cluster);
            let value;
            if (counts[index] === 0) {
                value = null;
            } else {
                value = sums.reduce((acc, el) => acc + el) / counts[index];
            }

            clusterNameToValue[clusterName] = value;
        });

        const node = {
            name,
            ...clusterNameToValue
        };
        graphic.push(node);
    };

    getClusterName = cluster => `${cluster.host_name}:${cluster.port}(${cluster.cluster})`;

    renderContent = () => {
        return (
            <div className={css.root}>
                {this.renderUtils()}
                {this.renderGraphic()}
            </div>
        );
    };

    renderUtils = () => {
        return (
            <>
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
            </>
        );
    };

    renderGraphic = () => {
        const { clusters } = this.context;
        const { graphic } = this.state;

        return (
            <LineChart
                width={1000}
                height={400}
                data={graphic}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <XAxis dataKey="name" />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                {clusters.map((cluster, index) => (
                    <Line
                        key={index}
                        type="monotone"
                        dataKey={this.getClusterName(cluster)}
                        stroke={getColor(index)}
                        yAxisId={index}
                    />
                ))}
            </LineChart>
        );
    };

    onChangeSelect = event => {
        const intervalInHours = Number(event.target.value);

        this.setState({ intervalInHours });
    };

    render() {
        const { connectionIndex, connectionsStatuses } = this.context;

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

        return this.renderContent();
    }
}

export default Graphics;
