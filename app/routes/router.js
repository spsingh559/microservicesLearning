var router = require('express').Router();

//API Routes directory
var poRoutes= require('../api/v1/PO/PO.router');
var invRoutes= require('../api/v1/invoice/invoice.router');
//Routes for Purchase Order
router.use('/v1/po', poRoutes);
router.use('/v1/invoice', invRoutes);


exports = module.exports = router;
