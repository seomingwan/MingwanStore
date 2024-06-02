const express = require('express');

const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { productList, productOne } = require('../controllers/productController');

const router = express.Router();

router.post('/manage/productList', apiLimiter, productList); 

router.post('/manage/productOne', apiLimiter, productOne);

module.exports = router;