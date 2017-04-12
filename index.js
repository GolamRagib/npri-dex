let express = require( 'express' );
let bodyParser = require( 'body-parser' );

let webpack = require( 'webpack' );
let webpackMiddleware = require( 'webpack-dev-middleware' );

let mongoose = require( 'mongoose' );

require( 'dotenv' ).config();

// mongoose.connect( 'mongodb://localhost:27017/npri' );
mongoose.connect( process.env.MONGODB_SERVER );

let app = express();

app.use( bodyParser.json() );

app.use( webpackMiddleware( webpack( require( process.env.WEBPACK_CONFIG ) ) ) );

app.use( express.static( 'public' ) );

app.use( '/api/markers', require( './api/markers/index' ) );
app.use( '/api/facility', require( './api/facility/index' ) );

app.get( '*', ( req, res ) => res.sendFile( __dirname + '/public/index.html' ) )

app.listen( process.env.PORT || 8080 );
