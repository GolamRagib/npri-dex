let Marker = require( './model' );

exports.index = function(req, res) {
  res.status(404);
  res.send("Bounding box not provided");
}

exports.markers = function(req, res) {
  let latN = Number( req.params.latN );
  let latS = Number( req.params.latS );
  let lngE = Number( req.params.lngE );
  let lngW = Number( req.params.lngW );

  let box = [ [ lngE, latN ], [ lngW, latS ] ]

  Marker
  .find( { loc: { $geoWithin: { $box : box } } } )
  .select( 'loc' )
  .lean( true )
  .exec( function( err, markers ) {
    err ? ( res.status( 404 ), res.send( err ) ) : res.send( markers );
  } )
}
