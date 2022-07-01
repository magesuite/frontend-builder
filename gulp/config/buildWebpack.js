const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const jsonImporter = require('node-sass-json-importer');
const merge = require('webpack-merge');

const SkipUnchangedPlugin = require('../skipUnchangedPlugin');

const environment = require('../environment');
const paths = require('../paths');
const parentAliases = require('../parentAliases')();
const collectEntries = require('../collectEntries');
const configPaths = [...Object.values(parentAliases), paths.src];

/**
 * Returns information for scripts building.
 */
const settings = {
    // Provide webpack configuration allowing child themes to introduce their own.
    webpack: configPaths.reduce(
        (config, srcPath) => {
            const parentConfigPath = path.resolve(
                srcPath,
                '../webpack.config.js'
            );
            let childConfig = {};
            try {
                childConfig = require(parentConfigPath);
            } catch (error) {}

            return merge({}, config, childConfig);
        },
        {
            entry: collectEntries('entries/*.ts'),
            output: {
                filename: 'js/[name].js',
                path: path.join(paths.dist, 'web'),
                library: '[name]',
                libraryTarget: 'umd',
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: [
                            ...(environment.development
                                ? ['cache-loader']
                                : []),
                            {
                                loader: 'ts-loader',
                                options: {
                                    transpileOnly: true,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            ...(environment.development
                                ? ['cache-loader']
                                : []),
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    url: false,
                                    sourceMap: environment.development,
                                },
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: environment.development,
                                    plugins: [
                                        require('postcss-flexbugs-fixes')(),
                                        require('autoprefixer')(),
                                    ],
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sassOptions: {
                                        includePaths: [
                                            paths.src,
                                            'node_modules',
                                            ...Object.values(parentAliases),
                                        ],
                                        importer: jsonImporter(),
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            plugins: [
                new MiniCssExtractPlugin({
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: 'css/[name].css',
                    chunkFilename: 'css/[name].css',
                    ignoreOrder: true,
                }),

                new SkipUnchangedPlugin(),

                ...(environment.development
                    ? []
                    : [
                          new OptimizeCssAssetsPlugin({
                              cssProcessorPluginOptions: {
                                  preset: [
                                      'default',
                                      {
                                          discardComments: { removeAll: true },
                                          calc: false,
                                      },
                                  ],
                              },
                              canPrint: true,
                          }),
                      ]),
            ],
            resolve: {
                extensions: ['.tsx', '.ts', '.js'],
                alias: parentAliases,
                modules: [
                    paths.src,
                    'node_modules',
                    ...Object.values(parentAliases),
                ],
            },
            externals: {
                jquery: 'jquery',
                $: 'jquery',
                jQuery: 'jquery',
                Swiper: 'Swiper',
                'Magento_Ui/js/modal/modal': 'Magento_Ui/js/modal/modal',
                'Magento_Ui/js/lib/core/storage/local':
                    'Magento_Ui/js/lib/core/storage/local',
                Stickyfill: 'Stickyfill',
                'mage/translate': 'mage/translate',
                isMobile: 'isMobile',
                vendors: 'vendors',
                bootstrapSelect: 'bootstrapSelect',
            },
            devtool: environment.development
                ? 'inline-cheap-module-source-map'
                : false,
            mode: environment.development ? 'development' : 'production',
            watch: environment.watch,
        }
    ),
};

module.exports = settings;
