let express = require( 'express' );
let router = new express.Router();

let controller = require( './controller' );

router.get( '/', controller.index );
router.get( '/lat1=:lat1&lat2=:lat2&lng1=:lng1&lng2=:lng2', controller.markers );
router.get( '/*', controller.index );

module.exports = router;