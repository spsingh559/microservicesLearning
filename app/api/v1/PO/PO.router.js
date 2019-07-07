const router = require('express').Router();


const poController = require('./PO.Controller.js');
router.post('/',poController.createPO);
router.get('/requestorDept/:requestorDept/startRange/:startRange/endRange/:endRange',poController.viewPOByRequestorAndDateRange);
router.get('/poNum/:poNum', poController.viewAllVersionPoById);
exports = module.exports = router;
