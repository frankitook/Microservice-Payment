const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');


router.post('/crear-pago', PaymentController.crearPago);


router.post('/webhook/:idOrder', PaymentController.recibirNotificacion);

module.exports = router;