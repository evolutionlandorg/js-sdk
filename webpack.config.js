const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');

const path = require("path");
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

const plugins = [new CleanWebpackPlugin(), new Dotenv()];


if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin());
}

const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';
const optimization =
    isProd ? {
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    vendorOther: {
                        chunks: 'initial',
                        enforce: true,
                        name: 'vendor',
                        test: /node_modules\//
                    }
                }
            }
        }
    } : {}


module.exports = {
    devtool: isProd ? "source-map" : false,
    entry: "./src/index.js",
    output: isProd ? {
        chunkFilename: '[name].[chunkhash:8].js',
        filename: '[name].[hash:8].js',
        globalObject: '(typeof self !== \'undefined\' ? self : this)',
        path: path.join(__dirname, "dist")
    } : {
            filename: "evolutionland.min.js",
            globalObject: '(typeof self !== \'undefined\' ? self : this)',
            path: path.join(__dirname, "dist")
        },
    watch: isProd,
    watchOptions: {
        poll: 1000,
        aggregateTimeout: 2000,
        ignored: /node_modules/
    },
    ...optimization,
    module: {
        rules: [{
            test: /\.(js|mjs)$/,
            exclude: [/node_modules/],
            loader: require.resolve("babel-loader"),
            options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                    [
                        "@babel/env",
                        {
                            targets: {
                                ie: "11"
                            },
                            useBuiltIns: "usage"
                        }
                    ]
                ],
                plugins: [
                    "@babel/plugin-proposal-class-properties",
                    "@babel/plugin-transform-runtime",

                ]
            }
        }]
    },
    plugins
};