const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
      test: /\.html$/,
      use: [ {
        loader: 'html-loader',
        options: {
          minimize: true,
          removeComments: false,
          collapseWhitespace: false
        }
      }],
    },
    {
      test: /\.(png|jpe?g|gif)$/i,
      use: [
        {
          loader: 'file-loader',
        },
        
      ],
    },
  ]
  }
};
