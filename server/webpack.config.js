// // Copyright (c) Wictor Wilén. All rights reserved. 
// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT license.

// var webpack = require('webpack');
// const Dotenv = require('dotenv-webpack');
// var TSLintPlugin = require('tslint-webpack-plugin');

// var path = require('path');
// var fs = require('fs');
// var argv = require('yargs').argv;

// var debug = argv.debug !== undefined;
// const lint = argv["linting"];

// var nodeModules = {};
// fs.readdirSync('node_modules')
//     .filter(function (x) {
//         return ['.bin'].indexOf(x) === -1;
//     })
//     .forEach(function (mod) {
//         nodeModules[mod] = 'commonjs ' + mod;
//     });

// var config = {
//     entry: __dirname + '/src/index.ts',
//     mode: debug ? 'development' : 'production',
//     output: {
//         path: __dirname + '/dist',
//         filename: '[name].js',
//         devtoolModuleFilenameTemplate: debug ? '[absolute-resource-path]' : '[]'
//     },
//     externals: nodeModules,
//     devtool: 'source-map',
//     resolve: {
//         extensions: [".ts", ".js"],
//         alias: {}
//     },
//     target: 'node',
//     node: {
//         __dirname: false,
//         __filename: false,
//     },
//     module: {
//         rules: [{
//             test: /\.ts$/,
//             exclude: [/web/, /dist/],
//             loader: "ts-loader"
//         }]
//     },
//     plugins: []
// };

// if (lint !== false) {
//     config.plugins.push(new TSLintPlugin({
//         files: ['./src/*.ts']
//     }));
// }


// module.exports = config;
var path = require('path');
var fs = require('fs');


var isProd = process.env.NODE_ENV !== 'development';

var nodeModules = {};
fs.readdirSync('./node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });


module.exports = {
    entry: './src/index.ts',
    target: 'node',
    watch: !isProd,
    mode: isProd ? 'production' : 'development',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist')
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    externals: nodeModules
};