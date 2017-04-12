const webpack = require( 'webpack' );
const dotenv = require( 'dotenv-webpack' );

module.exports =
{ devtool: 'cheap-module-source-map',
  entry: "./entry.js",
  output:
  { path: "/",
    filename: "bundle.js" },
  plugins: [
    new dotenv( {
      path: './.env'
    } )
  ],
  module: {
    loaders: [
      { test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [ 'react', 'es2015', 'stage-2' ] }
      },
      { test: /\.css$/,
        loader:'style-loader!css-loader' },
      { test: /.scss$/,
        loaders: [ 'style', 'css', 'sass' ],
        exclude: /node_modules/ },
      { test: /\.(woff2?|ttf|eot|jpe?g|png|gif|svg)$/,
        loader: 'url?limit=1' }
    ]
  }
};
