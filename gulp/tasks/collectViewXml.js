const gulp = require('gulp');
const path = require('path');
const parser = require('fast-xml-parser');
const merge = require('lodash.merge');
const fs = require('fs-extra');
const PluginError = require('plugin-error');

const environment = require('../environment');
const settings = require('../config/collectViewXml');
const paths = require('../paths');

let firstRun = true;

const transformImage = imageArray => {
    return imageArray.reduce((acc, image) => {
        acc[image.id] = image;
        return acc;
    }, {});
};

const transformVar = (varArray = []) => {
    if (!varArray.reduce) {
        varArray = [varArray];
    }

    return varArray.reduce((acc, varObject) => {
        if (varObject.var && !varObject.text) {
            acc[varObject.name] = transformVar(varObject.var);
        } else if (!varObject.var && varObject.text) {
            acc[varObject.name] = varObject.text;
        } else if (!varObject.var && !varObject.text) {
            acc[varObject.name] = null;
        } else {
            acc[varObject.name] = {
                text: varObject.text,
                var: transformVar(varObject.var),
            };
        }

        return acc;
    }, {});
};

const parseViewXml = viewXmlPath => {
    let json = {};

    try {
        const xml = fs.readFileSync(viewXmlPath, 'utf8');
        json = parser.parse(xml, {
            ignoreAttributes: false,
            attributeNamePrefix: '',
            textNodeName: 'text',
        }).view;
    } catch (error) {
        console.error(error.message);
    }

    delete json.exclude;

    if (json.vars) {
        json.vars = json.vars.reduce ? json.vars : [json.vars];
        json.vars = json.vars.reduce((acc, variable) => {
            acc[variable.module] = transformVar(variable.var);
            return acc;
        }, {});
    }

    if (json.media) {
        json.media.images.image = transformImage(json.media.images.image);
    }

    delete json['xmlns:xsi'];
    delete json['xsi:noNamespaceSchemaLocation'];

    return json;
};

module.exports = function collectViewXml(cb) {
    const json = settings.src.reduce((json, viewXmlPath) => {
        return merge(json, parseViewXml(viewXmlPath));
    }, {});

    fs.outputFile(
        path.join(paths.src, 'etc/view.json'),
        JSON.stringify(json, null, 2),
        error => {
            if (error) {
                if (!environment.watch) {
                    throw new PluginError('collectViewXml', error.message);
                } else {
                    console.error(error.message);
                }
            }

            cb();
        }
    );
};
