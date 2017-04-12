let express = require('express');
let router = new express.Router();

let controller = require('./controller');

router.get( '/', controller.index);
router.get( '/:id', controller.facility);
router.get( '/*', controller.index);

module.exports = router;