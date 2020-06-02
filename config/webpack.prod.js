const merge = require('webpack-merge'),
    configFactory = require('./webpack.common'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = configFactory('production');

config.plugins.unshift(new CleanWebpackPlugin());

module.exports = merge(config, {
    devtool: 'source-map',
    plugins: [
        function () {
            this.plugin('done', function (stats) {
                if (stats.compilation.errors && stats.compilation.errors.length) {
                    console.error(stats.compilation.errors);
                    process.exit(1);
                }
            });
        }
    ]
});
