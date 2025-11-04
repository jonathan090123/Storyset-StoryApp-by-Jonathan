const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
        // Copy top-level manifest and favicon so they're available at site root
        {
          from: path.resolve(__dirname, 'manifest.json'),
          to: path.resolve(__dirname, 'dist/manifest.json'),
        },
        {
          from: path.resolve(__dirname, 'favicon.png'),
          to: path.resolve(__dirname, 'dist/favicon.png'),
        },
      ],
    }),
  ],
};
