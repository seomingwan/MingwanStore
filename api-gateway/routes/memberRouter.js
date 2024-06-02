const express = require('express');

const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { login, logout, join, getMemberInfo, updateMemberInfo, test } = require('../controllers/memberController');

const router = express.Router();

router.post('/manage/join', apiLimiter, join); 

router.post('/manage/login', apiLimiter, login);

router.get('/manage/logout', logout);

router.post('/manage/getMemberInfo', apiLimiter, verifyToken, getMemberInfo);

router.post('/manage/updateMemberInfo', apiLimiter, verifyToken, updateMemberInfo);

router.get('/manage/test', apiLimiter, verifyToken, test);

module.exports = router;