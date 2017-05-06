const Marker = require( './model' );

exports.index = function(req, res) {
  res.status(404);
  res.send("Bounding box not provided");
}

exports.markers = function(req, res) {
  const box = [ [ Number( req.params.lngE ), Number( req.params.latN ) ],
                [ Number( req.params.lngW ), Number( req.params.latS ) ] ];

  Marker
  .find( { loc: { $geoWithin: { $box : box } } } )
  .select( 'loc' )
  .lean( true )
  .exec( ( err, markers ) => { err
                               ? ( res.status( 404 ), res.send( err ) )
                               : res.send( markers );
  } )
}
