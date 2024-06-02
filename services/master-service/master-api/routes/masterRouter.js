const express = require('express');

const { productRegister } = require('../controllers/masterController');

const router = express.Router();

router.post('/productRegister', productRegister); 

module.exports = router;