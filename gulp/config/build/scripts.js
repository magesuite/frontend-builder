const path = require('path');

const environment = require('../../environment');
const paths = require('../../paths');
const parentAliases = require('../../parentAliases');

/**
 * Returns information for scripts building.
 */
const settings = {
    /**
     * Paths to watch for this task.
     */
    watch: [path.join(paths.src, '**/*.ts')],
    webpack: {
        entry: path.join(paths.src, 'bundle.ts'),
        output: {
            filename: 'bundle.js',
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
            ],
        },
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
