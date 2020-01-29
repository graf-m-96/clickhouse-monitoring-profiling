import React from 'react';
import ReactLoading from 'react-loading';
import Dropdown from '../../dropdown/dropdown';

import Table from '../table/table';
import { MainContext } from '../../../contexts';
import { hostStatuses } from '../../../constans';
import HostStatus from '../../hostsStatus/hostStatus';

import css from './clusters.css';

const rowLength = 4;

class Clusters extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = {
            hiddenColumns: {}
        };
    }

    renderSettings = () => {
        return (
            <div className={css.settings}>
                {this.renderHiddenColumns()}
            </div>
        );
    };

    renderHiddenColumns = () => {
        const { clustersColumns } = this.context;
        const rows = [];
        let currentRow = [];
        clustersColumns.forEach(field => {
            if (currentRow.length === rowLength) {
                rows.push(currentRow);
                currentRow = [];
            }

            currentRow.push(field);
        });
        rows.push(currentRow);

        return (
            <div className={css.hiddenColumns}>
                <Dropdown
                    classNameHeader={css.hiddenColumns__title}
                    header={<div>Hidden columns</div>}
                >
                    <table>
                        <tbody>
                            {rows.map((row, indexRow) => (
                                <tr key={indexRow}>
                                    {row.map((field, indexField) => (
                                        <td
                                            className={css.hiddenColumns__ceil}
                                            key={indexField}
                                        >
                                            <label className={css.hiddenColumns__label}>
                                                <input
                                                    type="checkbox"
                                                    onChange={event => this.toggleHiddenColumn(event, field.Header)}
                                                />
                                                {field.Header}
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Dropdown>
            </div>
        );
    };

    toggleHiddenColumn = (event, fieldName) => {
        const newHiddenColumns = {
            ...this.state.hiddenColumns,
            [fieldName]: event.target.checked
        };
        this.setState({ hiddenColumns: newHiddenColumns });
    };

    insertStatusIntoData = () => {
        const { clusters, clustersStatuses } = this.context;

        return clusters.map((cluster, index) => ({
            ...cluster,
            status: <HostStatus status={clustersStatuses[index]} />
        }));
    };

    render() {
        const { clustersColumns, clusters, connectionIndex, connectionsStatuses } = this.context;
        const { hiddenColumns } = this.state;

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

        if (!clusters) {
            return (
                <ReactLoading
                    type="spinningBubbles"
                    width="200px"
                    height="200px"
                    color="rgba(0, 0, 0, 0.3)"
                    className={css.loadingAnimation}
                />
            );
        }

        const totalClusters = this.insertStatusIntoData(clusters);

        return (
            <>
                {this.renderSettings()}
                <Table
                    allColumns={clustersColumns}
                    data={totalClusters}
                    hiddenColumns={hiddenColumns}
                    options={{ useFilter: false }}
                />
            </>
        );
    }
}

export default Clusters;
