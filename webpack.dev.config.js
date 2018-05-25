const webpack = require('webpack')
const path = require('path')
const pages = require('./pages')
const SRC_DIR = path.resolve(__dirname, 'src')
const OUTPUT_DIR = path.resolve(__dirname, 'dist')
const defaultInclude = [SRC_DIR];

module.exports = {
    entry: SRC_DIR + '/assets/js/app.js',
    output: {
        path: `${OUTPUT_DIR}`,
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/, use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ], include: [SRC_DIR]
            },
            {
                test: /\.js?$/, use: [
                    { loader: 'babel-loader' }
                ], include: defaultInclude
            },
            {
                test: /\.(png|jpg)$/, use: [
                    { loader: 'file-loader?name=assets/img/[name]__[hash:base64:5].[ext]' }
                ], include: defaultInclude
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/, use: [
                    { loader: 'file-loader?name=assets/font/[name]__[hash:base64:5].[ext]' }
                ], include: defaultInclude
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$'
                }]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
        ...pages
    ],
    devtool: "cheap-source-map",
    devServer: {
        contentBase: OUTPUT_DIR,
        hot: true,
        stats: {
            chunks: false,
            children: false
        },
        disableHostCheck: true
    },
    target: "web",
    mode: process.env.NODE_ENV ? 'production' : 'development'
}