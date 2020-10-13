const { merge } = require('webpack-merge'),
    { generate, ErrorHandlingPlugin } = require('./webpack.common'),
    path = require('path'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = generate('development');

config.plugins.unshift(new CleanWebpackPlugin());

module.exports = merge(config, {
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: path.resolve('src/environments/environment.ts'),
                loader: 'file-replace-loader',
                options: {
                    replacement: path.resolve('src/environments/environment.staging.ts'),
                    async: true
                }
            }
        ]
    },
    plugins: [
        new ErrorHandlingPlugin()
    ]
});