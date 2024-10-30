const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');


router.post('/crear-pago', PaymentController.crearPago);

router.get('/success', PaymentController.successPayment);
router.get('/failure', PaymentController.failurePayment);
router.get('/pending', PaymentController.pendingPayment);
router.post('/webhook', PaymentController.recibirNotificacion);

module.exports = router;