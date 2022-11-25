const path = require("path");
const { GriffelCSSExtractionPlugin } = require("@griffel/webpack-extraction-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const griffelInclude = [
    path.resolve(__dirname, "src"),
    /node_modules[\\/]@fluentui/,
    // see https://webpack.js.org/configuration/module/#condition
];
// https://github.com/timarney/react-app-rewired
module.exports = {
    /**
     *
     * @param {import("webpack").Configuration} webpackConfig
     * @param {*} env
     * @returns {import("webpack").Configuration}
     */
    webpack: (webpackConfig, env) => {
        webpackConfig.module.rules.unshift(
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                // Apply "exclude" only if your dependencies **do not use** Griffel
                // exclude: /node_modules/,
                include: griffelInclude,
                use: {
                    loader: GriffelCSSExtractionPlugin.loader,
                },
            },
            // https://react.fluentui.dev/?path=/docs/concepts-developer-build-time-styles--page
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                include: griffelInclude,
                use: {
                    loader: "@griffel/webpack-loader",
                    options: {
                        // see https://github.com/microsoft/griffel/tree/main/packages/webpack-loader#configuring-babel-settings
                        babelOptions: {
                            presets: ["@babel/preset-typescript"],
                        },
                    },
                },
            },
        );

        webpackConfig.plugins = webpackConfig.plugins.map((p) => {
            if (p instanceof MiniCssExtractPlugin) {
                return new MiniCssExtractPlugin({
                    ignoreOrder: true,
                    filename: "css/[name].[contenthash:6].css",
                });
            } else {
                return p;
            }
        });
        webpackConfig.plugins.push(new GriffelCSSExtractionPlugin());

        webpackConfig.output.filename = "js/[name].[contenthash:6].js";
        webpackConfig.output.chunkFilename = "js/[name].[contenthash:6].js";

        /* Any webpack configuration options: https://webpack.js.org/configuration */
        webpackConfig.optimization.splitChunks = {
            chunks: "all",
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 10,
            maxInitialRequests: 10,
            cacheGroups: {
                styles: {
                    // https://github.com/webpack-contrib/mini-css-extract-plugin#extracting-all-css-in-a-single-file
                    priority: 100,
                    name: "style",
                    type: "css/mini-extract",
                    chunks: "all",
                    enforce: true,
                },
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: "npm",
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
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
        return webpackConfig;
    },
};
