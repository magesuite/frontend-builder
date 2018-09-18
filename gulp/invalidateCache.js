const through = require('through2');
const del = require('del');
const log = require('fancy-log');
const path = require('path');
const paths = require('./paths');

const varCachePaths = [
    path.join(paths.var, 'cache/**/*'),
    path.join(paths.var, 'page_cache/**/*'),
];
let invalidateVarTimeout;

const varPipe = () =>
    through.obj((file, encoding, callback) => {
        clearTimeout(invalidateVarTimeout);
        invalidateVarTimeout = setTimeout(() => {
            log.info(
                'Clearing all files in "var/cache" and "var/page_cache"...'
            );
            del(varCachePaths, {
                force: true,
            });
        }, 500);

        callback(null, file);
    });

let staticPipeTimeout;
let staticPipePaths = [];

const staticPipe = () =>
    through.obj((file, encoding, callback) => {
        clearTimeout(staticPipeTimeout);
        staticPipePaths.push(
            path.join(paths.pubStatic, '**/*', path.basename(file.path))
        );
        staticPipeTimeout = setTimeout(() => {
            log.info('Clearing selected files in "pub/static/frontend"...');
            del(staticPipePaths, {
                force: true,
            });
            staticPipePaths = [];
        }, 500);

        callback(null, file);
    });

const static = files => {
    log.info('Clearing selected files in "pub/static/frontend"...');
    files = files.map(file =>
        path.join(paths.pubStatic, '**/*', path.basename(file))
    );
    del(files, {
        force: true,
    });
};

module.exports = {
    varPipe,
    static,
    staticPipe,
};
