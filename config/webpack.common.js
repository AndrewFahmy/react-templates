const path = require('path'),
    cssParsingPlugin = require('mini-css-extract-plugin'),
    jsPlugin = require('terser-webpack-plugin'),
    cssMinimizerPlugin = require('css-minimizer-webpack-plugin'),
    htmlPlugin = require('html-webpack-plugin'),
    progressPlugin = require('simple-progress-webpack-plugin'),
    webpack = require('webpack');


function configureTsLoader(env) {
    return {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
            loader: require.resolve('ts-loader')
        }
    };
}
function configureStylesLoader() {
    return {
        test: /.s?css$/,
        use: [cssParsingPlugin.loader, require.resolve('css-loader'), require.resolve('sass-loader')]
    };
}
function configureImageLoader() {
    return {
        test: /\.(png|jpeg|jpg|svg|gif)$/,
        use: [
            {
                loader: require.resolve('file-loader'),
                options: {
                    outputPath: 'assets/images',
                    name: '[name]_[contenthash:8].[ext]'
                }
            }
        ]
    };
}
function configureFontLoader() {
    return {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
            {
                loader: require.resolve('file-loader'),
                options: {
                    outputPath: 'assets/fonts',
                    name: '[name]_[contenthash:8].[ext]'
                }
            }
        ]
    };
}

function generateRules(env) {
    return [
        configureTsLoader(env),
        {
            enforce: "pre",
            test: /\.js$/,
            loader: require.resolve('source-map-loader')
        },
        configureStylesLoader(),
        configureImageLoader(),
        configureFontLoader()
    ];
}


function generatePlugins(env) {
    return [
        new progressPlugin(),

        new cssParsingPlugin({
            filename: 'styles_[contenthash:8].css',
            chunkFilename: 'styles_[contenthash:8].css'
        }),

        new htmlPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        })
    ];
}


function generate(env) {
    process.env.NODE_ENV = env;

    return {
        mode: env,
        entry: './src/index',
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: '[name]_[contenthash:8].js',
            publicPath: '/'
        },
        optimization: {
            minimizer: [new jsPlugin(), new cssMinimizerPlugin()],
            splitChunks: {
                chunks: 'all',
                filename: '[name]_[contenthash:8].js'
            }
        },
        resolve: {
            modules: [
                'node_modules',
                path.resolve(__dirname, 'src')
            ],
            extensions: ['.ts', '.tsx', '.js']
        },
        module: {
            rules: generateRules(env)
        },
        plugins: generatePlugins(env)
    };
}

class ErrorHandlingPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('Error Handling Plugin', (stats) => {
            if (stats.compilation.errors && stats.compilation.errors.length) {
                console.error(stats.compilation.errors);
                process.exit(1);
            }
        });
    }
}

module.exports = { generate, ErrorHandlingPlugin };