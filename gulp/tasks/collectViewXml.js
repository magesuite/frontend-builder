const path = require('path');
const parser = require('fast-xml-parser');
const merge = require('lodash.merge');
const fs = require('fs-extra');
const { stringify } = require('javascript-stringify');

const settings = require('../config/collectViewXml');
const paths = require('../paths');

const transformImage = (imageArray) => {
    imageArray = Array.isArray(imageArray) ? imageArray : [imageArray];
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
        if (!varObject.var && typeof varObject.text === 'undefined') {
            return acc;
        }

        if (varObject.var && typeof varObject.text === 'undefined') {
            acc[varObject.name] = transformVar(varObject.var);
        } else if (!varObject.var && typeof varObject.text !== 'undefined') {
            acc[varObject.name] = varObject.text;
        } else {
            acc[varObject.name] = {
                text: varObject.text,
                var: transformVar(varObject.var),
            };
        }

        return acc;
    }, {});
};

const parseViewXml = (viewXmlPath) => {
    let json = {};

    try {
        const xml = fs.readFileSync(viewXmlPath, 'utf8');
        json = parser.parse(xml, {
            ignoreAttributes: false,
            attributeNamePrefix: '',
            textNodeName: 'text',
        }).view;
    } catch (error) {}

    delete json.exclude;

    if (json.vars) {
        json.vars = json.vars.reduce ? json.vars : [json.vars];
        json.vars = json.vars.reduce((acc, variable) => {
            acc[variable.module] = transformVar(variable.var);
            return acc;
        }, {});
    }

    if (json.media) {
        // When there are images defined for only one module.
        if (json.media.images.image) {
            json.media.images.image = transformImage(json.media.images.image);
        // When there are images defined for multiple modules.
        } else if (Array.isArray(json.media.images)) {
            json.media.images = json.media.images.reduce(
                (images, module) => {
                    images.image = Object.assign(
                        images.image, 
                        images.image[module.image.id] = transformImage(module.image));
                    return images;
                },
                { image: {} }
            );
        }
        delete json.media.images['module'];
    }

    delete json['xmlns:xsi'];
    delete json['xsi:noNamespaceSchemaLocation'];

    return json;
};

/**
 * Converts given JavaScript object to SCSS map.
 * @param {object} obj Object to convert to SCSS.
 */
const objToScss = (obj) => {
    const json = JSON.stringify(obj, null, 2);

    return json.replace(/{/g, '(').replace(/}/g, ')');
};

/**
 * Saves view.xml object to JSON.
 * @param {object} viewXml Parsed view.xml object.
 */
const saveToJson = (viewXml) =>
    fs.outputFile(
        path.join(paths.src, 'etc/view.json'),
        JSON.stringify(viewXml, null, 2)
    );

/**
 * Saves view.xml object to TypeScript file.
 * @param {object} viewXml Parsed view.xml object.
 */
const saveToTypeScript = (viewXml) =>
    fs.outputFile(
        path.join(paths.src, 'etc/view.ts'),
        'export default ' +
            stringify(viewXml, null, 2, { skipUndefinedProperties: true })
    );

const saveToScss = (viewXml) => {
    const scss = `$view-xml: ${objToScss(viewXml)};`;

    return fs.outputFile(path.join(paths.src, 'etc/view.scss'), scss);
};

module.exports = function collectViewXml(cb) {
    const viewXml = settings.src.reduce((json, viewXmlPath) => {
        return merge(json, parseViewXml(viewXmlPath));
    }, {});

    saveToJson(viewXml)
        .then(saveToTypeScript(viewXml))
        .then(saveToScss(viewXml))
        .then(cb)
        .catch((err) => {});
};
