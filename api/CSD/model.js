let mongoose = require('mongoose');

let CSDSchema = new mongoose.Schema( {
  ID: Number, 
  NAME: String
}, { collection: 'CSD' } );

module.exports = mongoose.model( 'CSD', CSDSchema );