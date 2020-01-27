import React from 'react';
import PropTypes from 'prop-types';

import css from './globalFilter.css';

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter
}) {
    const count = preGlobalFilteredRows.length;

    return (
        <div className={css.globalFilter}>
            Search:{' '}
            <input
                value={globalFilter || ''}
                onChange={e => {
                    setGlobalFilter(e.target.value || undefined);
                }}
                placeholder={`${count} records...`}
            />
        </div>
    );
}

GlobalFilter.propTypes = {
    preGlobalFilteredRows: PropTypes.array,
    globalFilter: PropTypes.string,
    setGlobalFilter: PropTypes.func
};

export default GlobalFilter;
