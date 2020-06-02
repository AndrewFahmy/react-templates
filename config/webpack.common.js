const path = require('path'),
    cssParsingPlugin = require('mini-css-extract-plugin'),
    jsPlugin = require('terser-webpack-plugin'),
    cssOptimizationPlugin = require('optimize-css-assets-webpack-plugin'),
    htmlPlugin = require('html-webpack-plugin'),
    progressPlugin = require('simple-progress-webpack-plugin'),
    webpack = require('webpack');


function configureBabelLoader(env) {
    return {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: require.resolve('babel-loader'),
            options: {
                presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')],

                customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                plugins: [
                    [require.resolve('babel-plugin-named-asset-import'),
                        {
                            loaderMap: {
                                svg: {
                                    ReactComponent:
                                    '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                                },
                            },
                        },
                    ],
                ],
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: String(env).toLowerCase() !== 'development'
            }
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
function configureDataAssetsLoader() {
    return {
        test: /\.(json|xml)$/,
        use: [
            {
                loader: require.resolve('file-loader'),
                options: {
                    outputPath: 'assets/data',
                    name: '[name]_[contenthash:8].[ext]'
                }
            }
        ]
    };
}
function configureFileReplacementLoader(env) {
    const environment = String(env).toLowerCase();

    if (environment === 'production') return {
        test: path.resolve('src/environments/environent.js'),
        loader: 'file-replace-loader',
        options: {
            replacement: path.resolve('src/environments/environent.prod.js'),
            async: true
        }
    };

    else return {};
}

function generateRules(env) {
    return [
        configureBabelLoader(env),
        configureStylesLoader(),
        configureImageLoader(),
        configureFontLoader(),
        configureDataAssetsLoader(),
        configureFileReplacementLoader(env)
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
        entry: './src/main',
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: '[name]_[contenthash:8].js',
            publicPath: '/'
        },
        optimization: {
            minimizer: [new jsPlugin(), new cssOptimizationPlugin()],
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
            extensions: ['.js', '.jsx']
        },
        module: {
            rules: generateRules(env)
        },
        plugins: generatePlugins(env)
    };
}


module.exports = generate;