const express = require('express');

const { productList, productOne } = require('../controllers/productController');

const router = express.Router();

router.post('/productList', productList); 

router.post('/productOne', productOne); 

module.exports = router;