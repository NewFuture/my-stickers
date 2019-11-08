// Copyright (c) Wictor Wilén. All rights reserved. 
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// Load general config
// const config = require('./gulp.config');

// NodeJS
const fs = require('fs'),
    path = require('path');

// Gulp Base
const {
    src,
    dest,
    series,
    task
} = require('gulp');

// gulp plugins
const zip = require('gulp-zip'),
    replace = require('gulp-token-replace'),
    PluginError = require('plugin-error'),
    del = require('del');


// load references
const
    log = require('fancy-log'),
    ZSchema = require('z-schema'),
    request = require('request');

require('dotenv').config();

// TASK: nuke
task('nuke', () => {
    return del(['temp', 'dist']);
});

/**
 * Replace parameters in the manifest
 */
task('generate-manifest', (cb) => {
    return src('./src/manifest.json')
        .pipe(replace({
            tokens: process.env
        }))
        .pipe(dest('temp'));
});

/**
 * Schema validation
 */
task('schema-validation', (callback) => {

    let filePath = path.join(__dirname, 'temp/manifest.json');

    if (fs.existsSync(filePath)) {

        let manifest = fs.readFileSync(filePath, {
            encoding: 'UTF-8'
        }),
            manifestJson;

        try {

            manifestJson = JSON.parse(manifest);

        } catch (error) {

            callback(
                new PluginError(error.message)
            );
            return;

        }

        log('Using manifest schema ' + manifestJson.manifestVersion);

        let definition = {
            version: "1.5",
            schema: "https://developer.microsoft.com/en-us/json-schemas/teams/v1.5/MicrosoftTeams.schema.json"
        };

        if (definition === undefined) {
            callback(new PluginError("validate-manifest", "Unable to locate schema"));
            return;
        }

        if (manifestJson["$schema"] !== definition.schema) {
            log("Note: the defined schema in your manifest does not correspond to the manifestVersion");
        }

        let requiredUrl = definition.schema;
        let validator = new ZSchema();

        let schema = {
            "$ref": requiredUrl
        };

        request(requiredUrl, {
            gzip: true
        }, (err, res, body) => {
            if (!err) {
                validator.setRemoteReference(requiredUrl, JSON.parse(body));

                var valid = validator.validate(manifestJson, schema);
                var errors = validator.getLastErrors();
                if (!valid) {
                    callback(new PluginError("validate-manifest", errors.map((e) => {
                        return e.message;
                    }).join('\n')));
                } else {
                    callback();
                }
            } else {
                log.warn("WARNING: unable to download and validate schema: " + err.code);
                callback();
            }
        })

    } else {
        console.log('Manifest doesn\'t exist');
    }

});

task('validate-manifest', series('generate-manifest', 'schema-validation'));

/**
 * Creates the tab manifest
 */
task('zip', () => {
    return src([
        ".src/**/*.*",
        '!**/manifest.json'
    ])
        .pipe(src('./temp/manifest.json'))
        .pipe(zip("custom-stickers.zip"))
        .pipe(dest('../package'));
});

task('manifest', series('validate-manifest', 'zip'));