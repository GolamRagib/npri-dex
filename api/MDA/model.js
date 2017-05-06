const mongoose = require( 'mongoose' );
const bilingualName = require( '../bilingualName/schema.js' );

const MDASchema = new mongoose.Schema( bilingualName, { collection: 'MDA' } );

module.exports = mongoose.model( 'MDA', MDASchema );