const mongoose = require( 'mongoose' );
const unilingualName = require( '../unilingualName/schema.js' );

const ERSchema = new mongoose.Schema( unilingualName, { collection: 'ER' } );

module.exports = mongoose.model( 'ER', ERSchema );