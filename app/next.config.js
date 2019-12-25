const withCSS = require('@zeit/next-css');
const withReactSvg = require('next-react-svg');
const path = require('path');

const config = withCSS({
    cssModules: true
});

module.exports = withReactSvg({
    include: path.resolve(__dirname, 'src/public/icons'),
    webpack(config, options) {
        return config
    },
    ...config
});
