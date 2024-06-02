const express = require('express');

const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { productOrder, orderList } = require('../controllers/orderController');

const router = express.Router();

router.post('/manage/productOrder', apiLimiter, verifyToken, productOrder); 

router.post('/manage/orderList', apiLimiter, verifyToken, orderList);

module.exports = router;