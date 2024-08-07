const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/app.js', // Adjust the entry point as needed
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
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
