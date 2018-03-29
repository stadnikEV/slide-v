
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'prod';

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'slide-v.min.js',
    library: 'SlideV',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|bower_components|dist|test\/mocha|src\/utils\/matches-polyfill.js|src\/utils\/closest-polyfill.js|src\/utils\/math-sign-polyfil.js)/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['add-module-exports'],
          },
        },
      },
    ],
  },
};


if (NODE_ENV === 'dev') {
  module.exports.entry = './src/example/app.js';
  module.exports.watch = true;
  module.exports.devtool = 'inline-cheap-module-source-map';
  module.exports.devServer = {
    inline: true,
    port: 8080,
    contentBase: 'dist/',
  };
  module.exports.plugins = [
    new HtmlWebpackPlugin({
      template: './src/example/index.html',
    }),
  ];
  module.exports.module.rules.push({
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader'],
  });
}

if (NODE_ENV === 'prod') {
  module.exports.entry = './src/slide-v.js';
  module.exports.plugins = [
    new UglifyJsPlugin(),
  ];
}

if (NODE_ENV === 'test') {
  module.exports.entry = './test/test.js';
  module.exports.watch = true;
  module.exports.devtool = 'inline-cheap-module-source-map';
  module.exports.devServer = {
    inline: true,
    port: 8080,
    contentBase: 'dist/',
  };
  module.exports.plugins = [
    new HtmlWebpackPlugin({
      template: './test/index.html',
    }),
  ];
  module.exports.module.rules.push({
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader'],
  });
}
