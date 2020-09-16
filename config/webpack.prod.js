const { merge } = require('webpack-merge'),
    configFactory = require('./webpack.common'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = configFactory('production');

config.plugins.unshift(new CleanWebpackPlugin());

module.exports = merge(config, {
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: path.resolve('src/environments/environment.ts'),
                loader: 'file-replace-loader',
                options: {
                    replacement: path.resolve('src/environments/environment.prod.ts'),
                    async: true
                }
            }
        ]
    },
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