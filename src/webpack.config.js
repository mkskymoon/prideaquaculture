const path = require('path');
const webpack = require('webpack'); // Ensure this line is present
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/app.js', // Adjust the entry point as needed
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')},
    resolve: {
    fallback: {
      "assert": require.resolve("assert/"),
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "console": require.resolve("console-browserify"),
      "fs": false, // If you don't need fs in the browser
      "node:events": require.resolve("events/"),
      "node:fs/promises": require.resolve("fs/promises"),
      "node:fs": require.resolve("fs/")
    }
  },
  
  mode: 'development',
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "url": require.resolve("url/"),
      "string_decoder": require.resolve("string_decoder/"),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
