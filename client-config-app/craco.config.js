// https://github.com/dilanx/craco/blob/master/packages/craco/README.md#configuration
module.exports = {
    webpack: {
        /**
         *
         * @param {import("webpack").Configuration} webpackConfig
         * @param {*} param1
         * @returns {import("webpack").Configuration}
         */
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.module.rules.unshift(
                // https://react.fluentui.dev/?path=/docs/concepts-developer-build-time-styles--page
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
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
            /* Any webpack configuration options: https://webpack.js.org/configuration */
            webpackConfig.optimization.splitChunks = {
                chunks: "all",
                minRemainingSize: 0,
                minChunks: 1,
                maxAsyncRequests: 10,
                maxInitialRequests: 10,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
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
    },
};
