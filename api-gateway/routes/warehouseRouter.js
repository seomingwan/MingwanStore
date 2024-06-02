const express = require('express');

const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { getWarehouseList } = require('../controllers/warehouseController');

const router = express.Router();

router.get('/manage/getWarehouseList', apiLimiter, getWarehouseList); 

module.exports = router;