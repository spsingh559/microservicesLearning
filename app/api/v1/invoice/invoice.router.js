const router = require('express').Router();


const invoiceController = require('./invoice.controller.js');
router.post('/',invoiceController.createInvoice);
router.get('/po/:po_num/version/:po_ver/',invoiceController.getInvoiceByPOAndVersion);
// router.get('/requestorDept/:requestorDept/startRange/:startRange/endRange/:endRange',poController.viewPOByRequestorAndDateRange);
exports = module.exports = router;