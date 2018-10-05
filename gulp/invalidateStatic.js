const through = require('through2');
const del = require('del');
const log = require('fancy-log');
const path = require('path');
const paths = require('./paths');

const clean = files => {
    log.info('Clearing selected files in "pub/static/frontend"...');
    files = files.map(file =>
        path.join(paths.pubStatic, '**/*', path.basename(file))
    );
    del(files, {
        force: true,
    });
};

let staticPipeTimeout;
let staticPipePaths = [];

const pipe = () =>
    through.obj((file, encoding, callback) => {
        clearTimeout(staticPipeTimeout);
        staticPipePaths.push(file.path);
        staticPipeTimeout = setTimeout(() => {
            clean(staticPipePaths);
            staticPipePaths = [];
        }, 1000);

        callback(null, file);
    });

module.exports = {
    clean,
    pipe,
};
