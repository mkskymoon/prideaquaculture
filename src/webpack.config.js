const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/app.js', // Adjust the entry point as needed
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()],
  resolve: {
    alias: {
      'node:util': 'util',
      'node:path': 'path-browserify',
      'node:crypto': 'crypto-browserify',
      'node:console': 'console-browserify',
      'node:fs/promises': 'fs/promises',
      'node:fs': 'fs',
      'node:stream': 'stream-browserify',
      'node:string_decoder': 'string_decoder',
      'node:url': 'url',
      'node:events': 'events',
    },
    fallback: {
      "assert": require.resolve("assert/"),
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "console": require.resolve("console-browserify"),
      "fs": false, // If you don't need fs in the browser
      "events": require.resolve("events/"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "url": require.resolve("url/"),
      "string_decoder": require.resolve("string_decoder/"),
    }
  },
  mode: 'development',
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new NodePolyfillPlugin()
  ],
};
