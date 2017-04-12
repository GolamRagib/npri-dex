let mongoose = require('mongoose');

let MDASchema = new mongoose.Schema( {
  ID: Number, 
  NAME_EN: String,
  NAME_FR: String
}, { collection: 'MDA' } );

module.exports = mongoose.model( 'MDA', MDASchema );