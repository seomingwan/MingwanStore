const express = require('express');

const { productOrder, orderList } = require('../controllers/orderController');

const router = express.Router();

router.post('/productOrder', productOrder);

router.post('/orderList', orderList);

module.exports = router;