const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');

const path = require("path");
const plugins = [ new Dotenv()];

if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin());
}



module.exports = {
    devtool: "source-map",
    entry: "./src/index.js",
    output: {
        filename: "evolutionland.min.js",
        path: path.join(__dirname, "dist")
    },
    module: {
        rules: [
            {
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
            }
        ]
    },
    plugins
};
