let mongoose = require('mongoose');

let ECOZONESchema = new mongoose.Schema( {
  ID: Number, 
  NAME_EN: String, 
  NAME_FR: String
}, { collection: 'ECOZONE' } );

module.exports = mongoose.model( 'ECOZONE', ECOZONESchema );