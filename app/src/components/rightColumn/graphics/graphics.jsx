import React from 'react';

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

class Graphics extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = {
            interval: 1
        };
    }

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
            { name: 'Page J', uv: 189, pv: 4800 }
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
        // const { connectionIndex, connectionsStatuses } = this.context;
        //
        // if (connectionIndex === undefined) {
        //     return (
        //         <div className={css.errorMessage}>
        //             Connection is not selected
        //         </div>
        //     );
        // }
        //
        // if (connectionsStatuses[connectionIndex] === hostStatuses.unachievable) {
        //     return (
        //         <div className={css.errorMessage}>
        //             Connection is not unachievable
        //         </div>
        //     );
        // }

        return this.renderContent();
    }
}

export default Graphics;
