const mysql      = require('mysql');
const dbconfig   = require('../config/mysqlDatabase');
const connection = mysql.createConnection(dbconfig);

// 상품 리스트
exports.productList = async (req, res, next) => 
{
  const { typeName } = req.body;
  
  try 
  {
    connection.query(`select * from product where typeName='${typeName}'`, async (error, rows) => 
    {

      if(error) throw error;

      return res.json({ rows });
    })
  } 
  catch (error) 
  {
    console.error(error);
    return next(error);
  }
}

// 상품 상세보기
exports.productOne = async (req, res, next) => 
{
  const { no } = req.body;
  
  try 
  {
    connection.query(`select * from product where no='${no}'`, async (error, rows) => 
    {

      if(error) throw error;

      return res.json({ rows });
    })
  } 
  catch (error) 
  {
    console.error(error);
    return next(error);
  }
}
