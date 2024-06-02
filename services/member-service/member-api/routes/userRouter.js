const express = require('express');

const { join, logout, getMemberInfo, updateMemberInfo, test } = require('../controllers/userController');

const router = express.Router();

router.post('/join', join); 

router.get('/logout', logout); 

router.post('/getMemberInfo', getMemberInfo); 

router.post('/updateMemberInfo', updateMemberInfo); 

router.get('/test', test); 

module.exports = router;