let webpack = require( 'webpack' );
let CompressionPlugin = require( 'compression-webpack-plugin' );

module.exports =
{ entry: "./entry.js",
  output:
  { path: "/",
    filename: "bundle.js" },
  plugins: [
    new webpack.DefinePlugin( {
      'process.env': {
        'NODE_ENV': JSON.stringify( 'production' ),
        'GOOGLE_MAPS_API_KEY': JSON.stringify( process.env.GOOGLE_MAPS_API_KEY )
      }
    } ),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin( { compress: { warnings: false } } ),
    new CompressionPlugin( {
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
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
