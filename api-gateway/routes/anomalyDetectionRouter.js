const express = require('express');

const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { rollbackRecord } = require('../controllers/anomalyDetectionController');

const router = express.Router();

router.post('/manage/rollbackRecord', rollbackRecord); 

module.exports = router;