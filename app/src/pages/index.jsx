import React from 'react';
import Head from 'next/head';

import Header from '../components/header/header';
import Main from '../components/main/main';

import css from './index.css';

export default () => (
    <>
        <Head>
            <title>ClickHouse Web</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
        </Head>
        <style jsx global>{`
             body { 
                margin: 0;
             }
             `}
        </style>
        <div className={css.app}>
            <Header />
            <Main />
        </div>
    </>
);
