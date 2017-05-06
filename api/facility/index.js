const express = require('express');
const router = new express.Router();

const controller = require('./controller');

router.get( '/', controller.index);
router.get( '/:id', controller.facility);
router.get( '/*', controller.index);

module.exports = router;