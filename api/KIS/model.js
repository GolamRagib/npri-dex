const mongoose = require( 'mongoose' );
const bilingualName = require( '../bilingualName/schema.js' );

const KISSchema = new mongoose.Schema( bilingualName, { collection: 'KIS' } );

module.exports = mongoose.model( 'KIS', KISSchema );