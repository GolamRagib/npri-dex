const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema( {
  loc: {
    coordinates: [ Number ], 
    type: {
      type: String, 
      default: 'Point'
    }
  }
}, { collection: 'facilities' } );

locationSchema.index( {
  loc: '2dsphere'
} );

module.exports = mongoose.model( 'Location', locationSchema );