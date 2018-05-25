const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = [
    // Normal Pages
    new HtmlWebpackPlugin({
        title: "Simple Front End App",
        template: "!!ejs-compiled-loader!./src/pages/index.ejs",
        filename: "index.html"
    })
]