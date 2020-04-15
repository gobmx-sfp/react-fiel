const path = require('path');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        // /\.(css|scss)$/ or even just /\.css$/
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(png|gif|jpg|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 50000,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.scss', '.js', '.json', '.png', '.gif', '.jpg', '.svg'],
    alias: { 'react-dom': '@hot-loader/react-dom' },
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '',
    filename: 'react-fiel.js',
    library: '@gobmx-sfp/react-fiel',
    libraryTarget: 'umd',
  },
};
