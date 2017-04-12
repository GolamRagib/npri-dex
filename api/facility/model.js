let mongoose = require('mongoose');

let facilitySchema = new mongoose.Schema( {
  NPRI_ID: String, 
  COMP_NAME: String, 
  FACI_NAME: String, 
  ADDR1: String, 
  ADDR2: String, 
  CITY: String, 
  PROVINCE: String, 
  POSTAL_CODE: String, 
  CMA: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CMA'
  }, 
  CSD: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CSD'
  }, 
  ECOZONE: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ECOZONE'
  }, 
  ER: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ER'
  }, 
  KIS: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'KIS'
  }, 
  MDA: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MDA'
  }, 
  DATUM: Number, 
  loc: {
    coordinates: [ Number ], 
    type: {
      type: String, 
      default: 'Point'
    }
  }
}, { collection: 'facilities' } );

facilitySchema.index( {
  loc: '2dsphere'
} );

module.exports = mongoose.model( 'Facility', facilitySchema );