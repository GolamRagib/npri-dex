const mongoose = require( 'mongoose' );
const unilingualName = require( '../unilingualName/schema.js' );

const CMASchema = new mongoose.Schema( unilingualName, { collection: 'CMA' } );

module.exports = mongoose.model( 'CMA', CMASchema );