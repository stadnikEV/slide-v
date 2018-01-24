const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/slide-v.js',

  output: {
    filename: './bundle/slide-v.js',
  },

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules|bower_components/,
        loader: "eslint-loader",
        options: {
          // several examples !

          // default value
          formatter: require("eslint/lib/formatters/stylish"),

          // community formatter
          //formatter: require("eslint-friendly-formatter"),

          // custom formatter
          //formatter: function(results) {
            // `results` format is available here
            // http://eslint.org/docs/developer-guide/nodejs-api.html#executeonfiles()

            // you should return a string
            // DO NOT USE console.*() directly !
            // return "OUTPUT"
        }
      },
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