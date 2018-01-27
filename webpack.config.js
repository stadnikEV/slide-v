const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const path = require('path');

module.exports = {
  entry: './src/slide-v.js',

  output: {
    filename: './bundle/slide-v.js'
  },

  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.js$/,
      //   exclude: /(node_modules|bower_components)/,
      //   loader: 'eslint-loader',
      //   options: {
      //    eslintPath: path.join(__dirname, '/node_modules/eslint-config-airbnb-standard/node_modules/eslint')
      //   }
      // },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },

  plugins: [
    new UglifyJsPlugin()
  ]

};
