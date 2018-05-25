const webpack = require('webpack')
const path = require('path')
const pages = require('./pages')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const pkg = require('./package');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');
const defaultInclude = [SRC_DIR];

module.exports = {
  entry: {
    app: path.join(SRC_DIR, "/assets/js/app.js"),
    vendor: Object.keys(pkg.dependencies)
  },
  output: {
    path: `${OUTPUT_DIR}/`,
    publicPath: "./",
    filename: "assets/js/[name]-[chunkhash].js",
    chunkFilename: "assets/js/[chunkhash].min.js"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        },
        vendor: {
          chunks: "initial",
          name: "vendor",
          minChunks: 3
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          mangle: false,
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../../"
            }
          },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ],
        include: [SRC_DIR]
      },
      {
        test: /\.js?$/,
        use: [{ loader: "babel-loader" }],
        include: defaultInclude
      },
      {
        test: /\.(png|jpg)$/,
        use: [{ loader: "file-loader?name=assets/img/[name].[ext]" }],
        include: defaultInclude
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "file-loader?name=assets/font/[name]__[hash:base64:5].[ext]"
          }
        ],
        include: defaultInclude
      },
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: "$"
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].css",
      chunkFilename: "css/[id].css"
    }),
    new CleanWebpackPlugin(["dist"]),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "window.$": "jquery"
    }),
    new webpack.BannerPlugin(` 
@author ${pkg.author}  
@version ${pkg.version}
@date ${new Date().toISOString().slice(0, 10)}
    `),
    ...pages
  ],
  target: "web",
  mode: process.env.NODE_ENV ? "production" : "development"
};