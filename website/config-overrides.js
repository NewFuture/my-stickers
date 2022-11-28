const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

// https://github.com/timarney/react-app-rewired
module.exports = {
    /**
     *
     * @param {import("webpack").Configuration} webpackConfig
     * @param {*} env
     * @returns {import("webpack").Configuration}
     */
    webpack: (webpackConfig, env) => {
        /* Any webpack configuration options: https://webpack.js.org/configuration */
        webpackConfig.optimization.splitChunks = {
            chunks: "all",
            minRemainingSize: 1024,
            minChunks: 1,
            maxAsyncRequests: 10,
            maxInitialRequests: 10,
            cacheGroups: {
                // defaultVendors: {
                //     test: /[\\/]node_modules[\\/]/,
                //     priority: -10,
                //     name: "npm",
                //     reuseExistingChunk: true,
                // },
                default: {
                    minChunks: 2,
                    name: "chunks",
                    priority: -20,
                    reuseExistingChunk: true,
                },
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: "react",
                    chunks: "all",
                },
            },
        };

        webpackConfig.plugins.push(new HTMLInlineCSSWebpackPlugin());
        webpackConfig.output.filename = "js/[name].[contenthash:6].js";
        webpackConfig.output.chunkFilename = "js/[name].[contenthash:6].js";
        webpackConfig.output.assetModuleFilename = "static/[name].[hash:6][ext]";

        return webpackConfig;
    },
};
