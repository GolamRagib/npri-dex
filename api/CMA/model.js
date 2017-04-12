let mongoose = require('mongoose');

let CMASchema = new mongoose.Schema( {
  ID: Number, 
  NAME: String
}, { collection: 'CMA' } );

module.exports = mongoose.model( 'CMA', CMASchema );