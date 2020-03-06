const path = require('path')
module.exports = {
  /* Tells webpack to look into src directory and App.js,
   where the entry for all the dependencies of this project are located. */
  entry: path.join(__dirname, 'src/js', 'App.js'),
  // Look for everything in the src directory and compile it
  devServer: {
    contentBase: path.join(__dirname, 'src'),
  },
  // Take all the dependencies that are specified and bundle into a single build to the output.
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'build.js'
  },
  // Module loaders
  module: {
    rules: [
      {
        // Tells how to load css files.
        test: /\.css$/,
        use: ['style-loader','css-loader'],
        include: [/src/, /node_modules/]
      }, {
        // Tells how to load jsx templates for react.
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      }, {
        // Json loader and specified the contracts directory that is exposed by truffle.
        test: /\.json$/,
        loader: 'json-loader',
        include: '/build/contracts/'
      }
    ]
  }
}
