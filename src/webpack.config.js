const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/app.js',
  target: 'node', // important to handle node-specific modules
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [nodeExternals()], // exclude node_modules
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'node-loader',
        include: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
