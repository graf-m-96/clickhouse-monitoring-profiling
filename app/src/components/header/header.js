import React from 'react';

import css from "./header.css"

class Header extends React.Component {
    render() {
        return (
            <header className={css.container}>
                <h1 className={css.title}>
                    Мониторинг и профилирование ClickHouse
                </h1>
            </header>
        );
    }
}

export default Header;