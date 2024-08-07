const path = require('path');
const webpack = require('webpack'); // Ensure this line is present
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js', // Adjust the entry point as needed
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()],
  resolve: {
    fallback: {
      "assert": require.resolve("assert/"),
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "console": require.resolve("console-browserify"),
      "fs": false, // If you don't need fs in the browser
      "events": require.resolve("events/"),
      "stream": require.resolve("stream-brow
