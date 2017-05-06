const Facility = require( './model' );
const CMA = require( '../CMA/model' );
const CSD = require( '../CSD/model' );
const ECOZONE = require( '../ECOZONE/model' );
const ER = require( '../ER/model' );
const KIS = require( '../KIS/model' );
const MDA = require( '../MDA/model' );

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
