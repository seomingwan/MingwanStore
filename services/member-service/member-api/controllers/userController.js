const mysql      = require('mysql');
const dbconfig   = require('../config/mysqlDatabase');
const connection = mysql.createConnection(dbconfig);

const bcrypt = require('bcrypt');

// 회원가입
exports.join = async (req, res, next) => 
{
  const { name, email, password, phone, terms } = req.body;
  
  try 
  {
    connection.query(`select * from users where email='${email}'`, async (error, rows) => 
    {

      if(error) throw error;

      if(rows.length)
      {
        return res.json({ message: '이미 가입된 이메일입니다.' });
      }
      
      if(password)
      {
        const hash = await bcrypt.hash(password, 12);

        connection.query(`insert into users(name, email, password, phone, terms) values('${name}', '${email}', '${hash}', '${phone}', '${terms}')`, (error, rows) => 
        {
          if(error) throw error;

          return res.json({ name: name, email: email });
        })
      }
      
    })
  } 
  catch (error) 
  {
    console.error(error);
    return next(error);
  }
}

// 로그아웃
exports.logout = async (req, res, next) => 
{
  return res.json({
    code: 200,
    message: '로그아웃',
  });
}

// 회원 정보 불러오기
exports.getMemberInfo = (req, res, next) => 
{
  const { userEmail } = req.body;
  
  try {
    connection.query(`select * from users where email = '${userEmail}'`, async (error, rows) => {
      if(error) throw error;

      return res.json({
        code: 200,
        rows,
      });
      
    })

  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// 회원 정보 수정
exports.updateMemberInfo = (req, res, next) => 
{
  const { userEmail, userName, userPhone } = req.body;
  
  try {
    connection.query(`update users set name='${userName}', phone='${userPhone}' where email = '${userEmail}'`, async (error, rows) => {
      if(error) throw error;

      return res.status(200).json({
        code: 200,
        message: '회원정보가 수정되었습니다.',
      });
      
    })

  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// 테스트
exports.test = (req, res, next) => 
{
  const email = req.headers.email;
  
  try {
    connection.query(`select * from users where email = '${email}'`, async (error, rows) => {
      if(error) throw error;

      return res.json({
        code: 200,
        message: '테스트 성공',
      });
      
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
};