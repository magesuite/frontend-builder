const fs = require('fs');
const util = require('util');

const DefaultRegistry = require('undertaker-registry');

const buildWebpack = require('./gulp/tasks/build/scripts');

function MagesuiteRegistry() {
    DefaultRegistry.call(this);
}
util.inherits(MagesuiteRegistry, DefaultRegistry);

MagesuiteRegistry.prototype.init = function(taker) {
    taker.task(buildWebpack);
};

module.exports = new MagesuiteRegistry();
