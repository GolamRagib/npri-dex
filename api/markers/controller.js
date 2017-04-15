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
  .exec( function( err, records ) {
    let apiResponse = [];
    records.map( ( record ) => {
      let apiResponseRecord = new Object();
      let apiResponseRecordOptions = new Object();

      apiResponseRecordOptions.id = record._id;

      apiResponseRecord.lat = record.loc.coordinates[1];
      apiResponseRecord.lng = record.loc.coordinates[0];
      apiResponseRecord.options = apiResponseRecordOptions;

      apiResponse.push( apiResponseRecord );
    })
    err 
      ? ( res.status( 404 ), res.send( err ) ) 
      : res.send( apiResponse );
  } )
}
