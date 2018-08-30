const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const environment = require('../../environment');
const paths = require('../../paths');
const parentAliases = require('../../parentAliases');
const collectEntries = require('../../collectEntries');

/**
 * Returns information for scripts building.
 */
const settings = {
    /**
     * Paths to watch for this task.
     */
    watch: [path.join(paths.src, '**/*.ts')],
    webpack: {
        entry: collectEntries(path.join(paths.src, 'entries/*.ts')),
        output: {
            filename: '[name].js',
            path: path.join(paths.dist, 'web'),
            library: 'bundle',
            libraryTarget: 'umd',
        },
        externals: [
            function(context, request, callback) {
                if (!/^[\.\/]+/.test(request)) {
                    return callback(null, request);
                }
                callback();
            },
        ],
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
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: parentAliases(),
        },
        devtool: environment.development ? 'inline-source-map' : false,
        mode: environment.development ? 'development' : 'production',
        watch: environment.watch,
    },
};

module.exports = settings;
