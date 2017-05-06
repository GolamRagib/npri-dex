const mongoose = require( 'mongoose' );
const bilingualName = require( '../bilingualName/schema.js' );

const ECOZONESchema = new mongoose.Schema( bilingualName, { collection: 'ECOZONE' } );

module.exports = mongoose.model( 'ECOZONE', ECOZONESchema );