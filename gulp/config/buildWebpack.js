import path from 'path';
import { createRequire } from 'module';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { merge } from 'webpack-merge';

import SkipUnchangedPlugin from '../skipUnchangedPlugin.js';
import environment from '../environment.js';
import paths from '../paths.js';
import parentAliasesFn from '../parentAliases.js';
import collectEntries from '../collectEntries.js';

// createRequire allows synchronous loading of CJS theme webpack.config.js overrides
// from within this ESM module. Theme configs are CJS and cannot be loaded with
// static import or dynamic import() without restructuring to async.
const require = createRequire(import.meta.url);

const parentAliases = parentAliasesFn();
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
            } catch {}

            return merge({}, config, childConfig);
        },
        {
            entry: collectEntries('entries/*.ts'),
            output: {
                filename: 'js/[name].js',
                path: path.join(paths.dist, 'web'),
                library: {
                    name: '[name]',
                    type: 'umd',
                },
            },
            cache: {
                type: 'filesystem',
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: [
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
                                    postcssOptions: {
                                        plugins: [
                                            'postcss-flexbugs-fixes',
                                            'autoprefixer',
                                        ],
                                    },
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
                                        silenceDeprecations: [
                                            // sass-loader still uses the old Dart Sass callback-based
                                            // JS API. Remove once sass-loader ships modern async API support.
                                            'legacy-js-api',
                                            // Allow @import and global built-in functions (darken, lighten,
                                            // rgba($var, x) etc.) in themes that have not yet been migrated
                                            // to the @use/@forward module system.
                                            'import',
                                            'global-builtin',
                                            // Allow legacy slash-division (e.g. $value / 2) in un-migrated
                                            // SCSS. Remove once all themes are migrated to math.div().
                                            'slash-div',
                                            // Allow legacy color functions (lighten, darken, etc.) — Dart
                                            // Sass 1.79+ split these from global-builtin.
                                            'color-functions',
                                            // Allow legacy if() ternary function syntax in un-migrated SCSS.
                                            'if-function',
                                        ],
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
                          new CssMinimizerPlugin({
                              minimizerOptions: {
                                  preset: [
                                      'default',
                                      {
                                          discardComments: { removeAll: true },
                                          calc: false,
                                      },
                                  ],
                              },
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
            performance: {
                hints: environment.development ? false : 'warning',
            },
            devtool: environment.development
                ? 'inline-cheap-module-source-map'
                : false,
            mode: environment.development ? 'development' : 'production',
            watch: environment.watch,
        }
    ),
};

export default settings;
