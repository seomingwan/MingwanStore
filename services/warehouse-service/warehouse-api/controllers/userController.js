const mysql      = require('mysql');
const dbconfig   = require('../config/mysqlDatabase');
const connection = mysql.createConnection(dbconfig);

// 창고 보관 물품 리스트
exports.getWarehouseList = (req, res, next) => 
{
  try {
    connection.query(`select * from productstock`, async (error, rows) => {
      if(error) throw error;

      // console.log(rows)

      return res.json({
        code: 200,
        rows,
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
