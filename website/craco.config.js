// https://github.com/dilanx/craco/blob/master/packages/craco/README.md#configuration
module.exports = {
    webpack: {
        /**
         * 
         * @param {import("webpack").Configuration} webpackConfig 
         * @param {*} param1 
         * @returns 
         */
        configure: (webpackConfig, { env, paths }) => {
            /* Any webpack configuration options: https://webpack.js.org/configuration */
            webpackConfig.optimization.splitChunks = {
                chunks: 'all',
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
                        name: 'react',
                        chunks: 'all',
                    },
                },
            }
            return webpackConfig;
        }
    },
};