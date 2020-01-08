'use strict';

const withCSS = require('@zeit/next-css');
const withReactSvg = require('next-react-svg');
const path = require('path');

const nextConfig = withCSS({
    cssModules: true
});

module.exports = withReactSvg({
    include: path.resolve(__dirname, 'src/public/icons'),
    // eslint-disable-next-line no-unused-vars
    webpack(config, options) {
        return config;
    },
    ...nextConfig
});
