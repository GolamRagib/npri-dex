let Facility = require( './model' );
let CMA = require( '../CMA/model' );
let CSD = require( '../CSD/model' );
let ECOZONE = require( '../ECOZONE/model' );
let ER = require( '../ER/model' );
let KIS = require( '../KIS/model' );
let MDA = require( '../MDA/model' );

exports.index = function( req, res ) {
  res.status( 404 );
  res.send( "Facility ID not provided" );
}

exports.facility = function( req, res ) {
  Facility
  .findById( req.params.id )
  .populate( 'CMA CSD ECOZONE ER KIS MDA' )
  .lean( true )
  .exec( ( err, facility ) => { err 
                                ? ( res.status( 404 ), res.send( err ) ) 
                                : res.send( facility ) } )
};
