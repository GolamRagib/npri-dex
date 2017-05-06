const mongoose = require( 'mongoose' );
const unilingualName = require( '../unilingualName/schema.js' );

const CSDSchema = new mongoose.Schema( unilingualName, { collection: 'CSD' } );

module.exports = mongoose.model( 'CSD', CSDSchema );