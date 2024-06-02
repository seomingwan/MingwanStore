const mysql      = require('mysql');
const dbconfig   = require('../config/mysqlDatabase');
const connection = mysql.createConnection(dbconfig);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Redis = require('ioredis')
const client = new Redis({ host: 'redis-server', port: 6379 });

const httpProxy = require('http-proxy');

const options = {
  changeOrigin: true,
  target: {
      https: true
  }
}

const proxy = httpProxy.createProxyServer(options);

// 로그인
exports.login = async (req, res) => {

  const { email, password } = req.body;

  try {
    connection.query(`select * from users where email = '${email}'`, async (error, rows) => {
      if(error) throw error;

      if (!rows) 
      {
        return res.status(401).json({
          code: 401,
          message: '등록되지 않은 이메일입니다.',
        });
      }

      const result = await bcrypt.compare(password, rows[0].password);

      if(result)
      {
        let email = rows[0].email;
        let name = rows[0].name;
        
        const accesstoken = jwt.sign({
          email,
        }, process.env.JWT_SECRET, {
          expiresIn: '1d',
          issuer: 'mingwan',
        });

        const refreshtoken = jwt.sign({}, 
          process.env.JWT_SECRET, {
            expiresIn: "14d"
        });

        let accesstokenKey = email + accesstoken;
        let refreshtokenKey = email + refreshtoken;
        
        try
        {
          client.set(accesstokenKey, accesstoken);
          client.set(refreshtokenKey, refreshtoken);

          return res.json({
            code: 200,
            message: '토큰이 발급되었습니다',
            email,
            name,
            accesstoken,
            refreshtoken,
          });

        } catch (error) {
          console.error(error);
          return res.status(500).json({
            code: 500,
            message: '서버 에러',
          });
        }
      }
      else
      {
        return res.json({
          code: 401,
          message: '비밀번호가 틀립니다',
        });
      }
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }

  return;
};

// 회원가입
exports.join = async (req, res, next) => 
{
  
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res, { target: 'http://member-api:3000'}, function (error) {
    console.log("Proxy Error ", error)
  });
  
}

// 로그아웃
exports.logout = async (req, res, next) => 
{
  proxy.web(req, res, { target: 'http://member-api:3000'}, function (error) {
    console.log("Proxy Error ", error)
  });
}

// 회원 정보 불러오기
exports.getMemberInfo = async (req, res, next) => 
{
  
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res, { target: 'http://member-api:3000'}, function (error) {
    console.log("Proxy Error ", error)
  });
  
}

// 회원 정보 수정
exports.updateMemberInfo = async (req, res, next) => 
{
  
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res, { target: 'http://member-api:3000'}, function (error) {
    console.log("Proxy Error ", error)
  });
  
}

// 테스트
exports.test = (req, res, next) => 
{

  proxy.web(req, res, { target: 'http://member-api:3000'}, function (error) {
    console.log("Proxy Error ", error)
  });

};