const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.web.js',
  resolve: {
    extensions: ['.web.js', '.js'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|svg)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: '@hitbit/expo-svg-transformer',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
  },
};
