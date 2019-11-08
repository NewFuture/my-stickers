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
// const PluginError = require('plugin-error');


// load references
const nodemon = require('nodemon');
const argv = require('yargs').argv;
const log = require('fancy-log');
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

task('nodemon', (callback) => {
    var started = false;
    var debug = argv.debug !== undefined;

    // console.log(debug, process.env.NODE_ENV)
    return nodemon({
        script: 'dist/app.js',
        watch: ['dist/app.js'],
        env: {
            "NODE_ENV": debug ? "development" : "production"
        },
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

        if (err) throw new Error("webpack", err);

        var jsonStats = stats.toJson();

        if (jsonStats.errors.length > 0) {

            jsonStats.errors.map(e => {
                log('[Webpack error] ' + e);
            });

            throw new Error("webpack", "Webpack errors, see log");
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


    require('ngrok').connect(conf).then((url) => {
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
 * Build task, that uses webpack and injects scripts into pages
 */
task('build', parallel('webpack'));

task('serve', series('build', 'nodemon', 'watch'));

// task('ngrok-serve', series('start-ngrok', 'manifest', 'serve'));