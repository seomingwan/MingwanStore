const mysql      = require('mysql');
const dbconfig   = require('../config/mysqlDatabase');
const connection = mysql.createConnection(dbconfig);

const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cors = require('cors');                    

const Redis = require('ioredis')
const client = new Redis({ host: 'redis-server', port: 6379 });

exports.verifyToken = (req, res, next) => {
  try {
    res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {

    // accesstoken 이 만료됬을 경우
    if (error.name === 'TokenExpiredError') {

      if(req.headers.refresh !== 'undefined')
      {
        let refreshtokenKey = req.headers.email + req.headers.refresh
          
        client.get(refreshtokenKey,(err, refreshtoken)=>{
          try {
            const verifyResult = jwt.verify(refreshtoken, process.env.JWT_SECRET);
            
            const iat = JSON.parse(JSON.stringify(verifyResult)).iat

            if(iat)
            {
              // refreshtoken 검증 완료시 accesstoken 재발급
              const accesstoken = jwt.sign({
                email: req.headers.email,
              }, process.env.JWT_SECRET, {
                expiresIn: '1d',      // 유효기간 1분
                issuer: 'mingwan',   // 발급자
              });
          
              return res.json({
                code: 201,
                message: 'successful',
                accesstoken,
              });
            }
          } catch (error) {
            console.error(error);
            // refreshtoken 도 만료됬을 경우
            return res.status(401).json({
              code: 401,
              message: '다시 로그인 해주세요',
            });
          }
        })
      }
    }
  }
};

// API 사용량 제한
exports.apiLimiter = rateLimit({
  validationsConfig: false,
  windowMs: 60 * 1000, // 1분
  max: 30,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // 기본값 429
      message: '1분에 30번 만 요청할 수 있습니다.',
    });
  },

});

// 버전이 deprecated 되면 사용을 막기
exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
  });
};

// 등록된 도메인일 경우 cors 허가
exports.corsWhenDomainMatches = async (req, res, next) => {
  const url = new URL(req.get('origin')).host;
  
  connection.query(`select * from domain where host = '${url}'`, (error, rows) => {
    if(error) throw error;

    if (rows) {
      cors({ 
        origin: req.get('origin'),
        credentials: true,
      })(req, res, next);
    }else{
      next();
    }
  });
};