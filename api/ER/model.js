let mongoose = require('mongoose');

let ERSchema = new mongoose.Schema( {
  ID: Number, 
  NAME: String
}, { collection: 'ER' } );

module.exports = mongoose.model( 'ER', ERSchema );