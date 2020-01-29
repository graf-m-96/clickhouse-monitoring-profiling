import React from 'react';

import { getQueries, saveQueries } from '../../../lib/storage';
import List from './list/list';
import Sql from './sql/sql';
import TableSql from './tableSql/tableSql';

import css from './queriesListPage.css';

class QueriesListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queries: [],
            currentQuery: null
        };
    }

    componentDidMount() {
        const queries = getQueries();

        this.setState({ queries });
    }

    deleteQueryByIndex = index => {
        const { queries } = this.state;
        const newQueries = [...queries];
        newQueries.splice(index, 1);

        saveQueries(newQueries);
        this.setState({ queries: newQueries });
    }

    saveQueryFromSql = query => {
        const queries = [...this.state.queries, query];
        saveQueries(queries);
        this.setState({ queries });
    };

    runQueryByIndex = index => {
        this.setState({ currentQuery: this.state.queries[index] });
    };

    runQueryFromSql = query => {
        this.setState({ currentQuery: query });
    };

    render() {
        const { queries, currentQuery } = this.state;

        return (
            <div className={css.root}>
                <List
                    queries={queries}
                    deleteQueryByIndex={this.deleteQueryByIndex}
                    runQueryByIndex={this.runQueryByIndex}
                />
                <Sql
                    onRun={this.runQueryFromSql}
                    onSave={this.saveQueryFromSql}
                />
                <TableSql query={currentQuery} />
            </div>
        );
    }
}

export default QueriesListPage;
