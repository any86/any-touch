const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',

    // devtool: 'inline-source-map',

    devServer: {
        hot: true,
        contentBase: path.join(__dirname, "./example/threejs/static")
    },

    entry: './example/threejs/index.ts',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'a.bundle.js'
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            meta: {
                viewport: 'user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width',
            },
            title: 'three.js'
        })
    ],

    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },

    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
};