const { resolve } = require('path');

module.exports = {
  mode: 'production',

  entry: './src/index.jsx',

  output: {
    path: resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        include: resolve(__dirname, 'src'),
        exclude: /(node_modules|build)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  externals: {
    'react': 'commonjs react'
  }
};
