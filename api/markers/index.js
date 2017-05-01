let express = require( 'express' );
let router = new express.Router();

let controller = require( './controller' );

router.get( '/', controller.index );
router.get( '/latN=:latN&latS=:latS&lngE=:lngE&lngW=:lngW', controller.markers );
router.get( '/*', controller.index );

module.exports = router;