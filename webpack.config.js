var path = require('path');
var webpack = require('webpack');
var app_path = path.resolve(__dirname, "app");
var node_modules_path = path.resolve(__dirname, "node_modules");

module.exports = {
  entry: [
    './less/styles.less',
    './app/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'output')
  },
  module : {
    loaders : [
      {
        test: /\.jsx?$/,
        include: app_path,
        exclude: node_modules_path,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true,
              localIdentName: '[name]--[local]--[hash:base64:8]',
            },
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader"
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      options: {
        postcss: function() {
          return [
            /* eslint-disable global-require */
            require('postcss-cssnext'),
            /* eslint-enable global-require */
          ];
        }
      }
    })
  ]
};
