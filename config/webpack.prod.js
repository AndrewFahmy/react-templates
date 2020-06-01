const merge = require('webpack-merge'),
    configFactory = require('./webpack.common'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = configFactory('production');

config.plugins.unshift(new CleanWebpackPlugin());

module.exports = merge(config, {
    devtool: 'source-map',
});
