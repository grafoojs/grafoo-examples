const path = require("path");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = () => ({
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: ["babel-loader", "ts-loader"],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new HtmlPlugin({ template: "./src/index.html" }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: "eval",
  devServer: {
    host: "0.0.0.0",
    port: 3000,
    stats: "errors-only",
    hot: true
  }
});
