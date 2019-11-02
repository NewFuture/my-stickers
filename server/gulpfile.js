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
    watch,
    series,
    parallel,
    task
} = require('gulp');

// gulp plugins
const zip = require('gulp-zip'),
    replace = require('gulp-token-replace'),
    PluginError = require('plugin-error'),
    del = require('del');


// Web Servers
const ngrok = require('ngrok');

// load references
const
    nodemon = require('nodemon'),
    argv = require('yargs').argv,
    // autoprefixer = require('autoprefixer'),
    log = require('fancy-log'),
    ZSchema = require('z-schema'),
    request = require('request');

const webpack = require('webpack');

require('dotenv').config();

/**
 * Setting up environments
 */
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDev = !isProd && !isTest;

/**
 * Register watches
 */
const watches = () => {

    // all other watches
    watch(
        "./src/**/*.*",
        series('webpack')
    );

    // watch on new and deleted files
    // watch(config.injectSources)
    //     .on('unlink', injectSources)
    //     .on('add', injectSources);
}

task('watch', watches);

// TASK: nuke
task('nuke', () => {
    return del(['temp', 'dist']);
});

task('nodemon', (callback) => {
    var started = false;
    var debug = argv.debug !== undefined;

    return nodemon({
        script: 'dist/index.js',
        watch: ['dist/index.js'],
        nodeArgs: debug ? ['--inspect'] : []
    }).on('start', function () {
        if (!started) {
            callback();
            started = true;
            log('HOSTNAME: ' + process.env.HOSTNAME);
        }
    });
});


const _webpack = (config, callback) => {
    const webpackConfig = require(
        path.join(__dirname, config)
    )

    webpack(webpackConfig, (err, stats) => {

        if (err) throw new PluginError("webpack", err);

        var jsonStats = stats.toJson();

        if (jsonStats.errors.length > 0) {

            jsonStats.errors.map(e => {
                log('[Webpack error] ' + e);
            });

            throw new PluginError("webpack", "Webpack errors, see log");
        }
        if (jsonStats.warnings.length > 0) {
            jsonStats.warnings.map(function (e) {
                log('[Webpack warning] ' + e);
            });
        }
        callback();
    });
}

task('webpack', (callback) => {
    _webpack("webpack.config", callback);
});






/**
 * Replace parameters in the manifest
 */
task('generate-manifest', (cb) => {
    return src('../manifest/manifest.json')
        .pipe(replace({
            tokens: {
                ...process.env
            }
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
 * Task for starting ngrok and replacing the HOSTNAME with ngrok tunnel url.
 * The task also creates a manifest file with ngrok tunnel url.
 * See local .env file for configuration
 */
task('start-ngrok', (cb) => {
    log("[NGROK] starting ngrok...");
    let conf = {
        subdomain: process.env.NGROK_SUBDOMAIN,
        region: process.env.NGROK_REGION,
        addr: process.env.PORT,
        authtoken: process.env.NGROK_AUTH
    };


    ngrok.connect(conf).then((url) => {
        log('[NGROK] Url: ' + url);
        if (!conf.authtoken) {
            log("[NGROK] You have been assigned a random ngrok URL that will only be available for this session. You wil need to re-upload the Teams manifest next time you run this command.");
        }
        let hostName = url.replace('http://', '');
        hostName = hostName.replace('https://', '');

        log('[NGROK] HOSTNAME: ' + hostName);
        process.env.HOSTNAME = hostName

        cb();

    }).catch((err) => {
        log.error(`[NGROK] Error: ${JSON.stringify(err)}`);
        cb(err.msg);
    });
});

/**
 * Creates the tab manifest
 */
task('zip', () => {
    return src([
        "../manifest/**/*.*",
        '!**/manifest.json'
    ])
        .pipe(src('./temp/manifest.json'))
        .pipe(zip("custom-stickers.zip"))
        .pipe(dest('../package'));
});

task('manifest', series('validate-manifest', 'zip'));
/**
 * Build task, that uses webpack and injects scripts into pages
 */
task('build', parallel('webpack', 'manifest'));

task('serve', series('nuke', 'build', 'nodemon', 'watch'));

task('ngrok-serve', series('start-ngrok', 'manifest', 'serve'));