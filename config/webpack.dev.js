const merge = require('webpack-merge'),
    configFactory = require('./webpack.common');


const config = configFactory('development');

module.exports = merge(config, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 3000,
        historyApiFallback: true
    }
});