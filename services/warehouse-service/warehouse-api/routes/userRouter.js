const express = require('express');

const { getWarehouseList } = require('../controllers/userController');

const router = express.Router();

router.get('/getWarehouseList', getWarehouseList); 

module.exports = router;