let dotenv = require( 'dotenv' );
let express = require( 'express' );
let webpack = require( 'webpack' );
let mongoose = require( 'mongoose' );
let bodyParser = require( 'body-parser' );
let compression = require( 'compression' );
let webpackMiddleware = require( 'webpack-dev-middleware' );

dotenv.config();

mongoose.Promise = global.Promise;
// mongoose.connect( 'mongodb://localhost:27017/npri' );
mongoose.connect( process.env.MONGODB_SERVER );

let app = express();

app.use( bodyParser.json() );

app.use( compression() );

let WEBPACK_CONFIG = ( [ 'production', 'testing' ].includes( process.env.NODE_ENV ) )
                     ? './webpack.config.js'
                     : './webpack.dev.config.js' ;

app.use( webpackMiddleware( webpack( require( WEBPACK_CONFIG ) ) ) );

app.enable( 'trust proxy' );

app.use( function ( req, res, next ) {
  ( ( process.env.NODE_ENV === 'production' ) && ( req.secure === false ) )
  ? ( res.redirect( `https://${ req.headers.host }${ req.url }` ), next() )
  : next() ;
});

app.get( '*.js', function ( req, res, next ) {
  req.url = req.url + '.gz';
  res.set( 'Content-Encoding', 'gzip' );
  next();
});

app.use( express.static( 'public' ) );

app.use( '/api/markers', require( './api/markers/index' ) );
app.use( '/api/facility', require( './api/facility/index' ) );

app.get( '*', ( req, res ) => { res.sendFile( __dirname + '/public/index.html' ); } )

let port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
let host = process.env.OPENSHIFT_NODEJS_IP   || process.env.IP   || '0.0.0.0';

app.listen( port, host );
