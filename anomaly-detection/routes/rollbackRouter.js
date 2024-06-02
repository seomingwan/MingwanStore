const express = require('express');

const { rollbackRecord} = require('../controllers/rollbackController');

const router = express.Router();

router.post('/rollbackRecord', rollbackRecord); 

module.exports = router;