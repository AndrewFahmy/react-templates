const { merge } = require('webpack-merge'), { generate } = require('./webpack.common');


const config = generate('development');

module.exports = merge(config, {
    devtool: 'inline-source-map',
    devServer: {
        static: ['./dist'],
        compress: true,
        port: 3000,
        historyApiFallback: true,
        open: true
    }
});