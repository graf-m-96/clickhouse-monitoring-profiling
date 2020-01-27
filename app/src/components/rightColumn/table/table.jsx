import React, { useContext } from 'react';
import { useTable, useBlockLayout, useResizeColumns, useGlobalFilter } from 'react-table';
import { FixedSizeList } from 'react-window';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MainContext } from '../../../contexts';
import Filter from '../filter/filter';
import GlobalFilter from './globalFilter';
import { expandCeil, shrinkCeil } from '../../../lib/table';

import css from './table.css';

const heightColumn = 71;

function Table({
    allColumns,
    data,
    updateWhere,
    hiddenColumns = {},
    defaultColumn = { minWidth: 70, width: 250 }
}) {
    const columns = React.useMemo(() => (
        allColumns.filter(column => !hiddenColumns[column.Header])
    ), [allColumns, hiddenColumns]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        totalColumnsWidth,
        prepareRow,
        preGlobalFilteredRows,
        setGlobalFilter,
        state
    } = useTable(
        {
            columns,
            data,
            defaultColumn
        },
        useBlockLayout,
        useResizeColumns,
        useGlobalFilter
    );

    const RenderRow = React.useCallback(
        ({ index, style }) => {
            const row = rows[index];
            prepareRow(row);

            return (
                <div
                    {...row.getRowProps({ style })}
                    className={css.tr}
                >
                    {row.cells.map(cell => {
                        return (
                            <div
                                {...cell.getCellProps()}
                                className={css.td}
                                onDoubleClick={expandCeil(css.overflowCeilVisible)}
                            >
                                <div className={css.td__data}>
                                    {cell.render('Cell')}
                                </div>
                                <textarea
                                    className={classNames(css.overflowCeil)}
                                    onBlur={shrinkCeil(css.overflowCeilVisible)}
                                />
                            </div>
                        );
                    })}
                </div>
            );
        },
        [prepareRow, rows]
    );

    const context = useContext(MainContext);
    const header = headerGroups[0];
    const headerProps = React.useMemo(() => {
        const initialHeaderProps = header.getHeaderGroupProps();
        const realWidth = parseFloat(initialHeaderProps.style.width) - context.scrollWidth;

        return {
            ...initialHeaderProps,
            style: {
                ...initialHeaderProps.style,
                width: realWidth
            }
        };
    }, [context, header]);

    return (
        <div
            {...getTableProps()}
            className={css.table}
        >
            <div>
                <div
                    {...headerProps}
                    className={css.tr}
                >
                    {header.headers.map(column => (
                        <div
                            {...column.getHeaderProps()}
                            className={css.th}
                        >
                            <div className={css.th__data}>
                                {column.render('Header')}
                            </div>
                            <div className={css.th__type}>
                                {column.type}
                            </div>
                            <Filter
                                rawType={column.type}
                                fieldName={column.Header}
                                updateWhere={updateWhere}
                            />
                            <div
                                {...column.getResizerProps()}
                                className={css.resizer}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            <div
                {...getTableBodyProps()}
                className={css.table__body}
            >
                <FixedSizeList
                    height={5 * heightColumn}
                    itemCount={rows.length}
                    itemSize={heightColumn}
                    width={totalColumnsWidth}
                >
                    {RenderRow}
                </FixedSizeList>
            </div>
        </div>
    );
}

Table.propTypes = {
    allColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.array.isRequired,
    hiddenColumns: PropTypes.object,
    updateWhere: PropTypes.func,
    defaultColumn: PropTypes.object
};

export default Table;
