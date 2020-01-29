import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from '../../../dropdown/dropdown';
import Run from '../../../../public/icons/run.svg';
import Delete from '../../../../public/icons/delete.svg';

import css from './list.css';

class List extends React.Component {
    render() {
        const { queries, deleteQueryByIndex, runQueryByIndex } = this.props;

        return (
            <div className={css.root}>
                <Dropdown
                    classNameHeader={css.title}
                    header={<div>Queries list</div>}
                >
                    <div className={css.list}>
                        {queries.map((query, index) => (
                            <div
                                className={css.query}
                                key={index}
                            >
                                <div className={css.query__buttons}>
                                    <Run
                                        className={css.icon}
                                        title="Run"
                                        onClick={() => runQueryByIndex(index)}
                                    />
                                    <Delete
                                        className={css.icon}
                                        title="Delete"
                                        onClick={() => deleteQueryByIndex(index)}
                                    />
                                </div>
                                <div className={css.query__text}>
                                    {query}
                                </div>
                            </div>
                        ))}
                    </div>
                </Dropdown>
            </div>
        );
    }
}

List.propTypes = {
    queries: PropTypes.array.isRequired,
    deleteQueryByIndex: PropTypes.func.isRequired,
    runQueryByIndex: PropTypes.func.isRequired
};


export default List;
