let Marker = require( './model' );

exports.index = function(req, res) {
  res.status(404);
  res.send("Bounding box not provided");
}

exports.markers = function(req, res) {
  let lat1 = Number( req.params.lat1 );
  let lat2 = Number( req.params.lat2 );
  let lng1 = Number( req.params.lng1 );
  let lng2 = Number( req.params.lng2 );

  let box = [ [ lng1, lat1 ], [ lng2, lat2 ] ]

  Marker
  .find( { loc: { $geoWithin: { $box : box } } } )
  .select( 'loc' )
  .lean( true )
  .exec( function( err, markers ) {
    err ? ( res.status( 404 ), res.send( err ) ) : res.send( markers );
  } )
}
