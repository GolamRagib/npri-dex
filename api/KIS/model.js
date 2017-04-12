let mongoose = require('mongoose');

let KISSchema = new mongoose.Schema( {
  ID: Number, 
  NAME_EN: String, 
  NAME_FR: String
}, { collection: 'KIS' } );

module.exports = mongoose.model( 'KIS', KISSchema );