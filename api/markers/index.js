const express = require( 'express' );
const router = new express.Router();

const controller = require( './controller' );

router.get( '/', controller.index );
router.get( '/latN=:latN&latS=:latS&lngE=:lngE&lngW=:lngW', controller.markers );
router.get( '/*', controller.index );

module.exports = router;