const mysql      = require('mysql');
const dbconfig   = require('../config/mysqlDatabase');
const connection = mysql.createConnection(dbconfig);

// 롤백 기록
exports.rollbackRecord = async (req, res, next) => 
{
  const { productNo, productName, userEmail, price, cnt, deliveryFee, point  } = req.body;

  setTimeout(() => {
    try {
      connection.query(`select * from rollbackRecord where productNo='${productNo}' and userEmail='${userEmail}' `, async (error, rows) => {
        if(error) throw error;

        if(rows[0])
        {
          connection.query(`delete from rollbackRecord where productNo='${productNo}' and userEmail='${userEmail}' `, async (error, rows) => {
            if(error) throw error;

            return res.json({
              code: 500,
              // rows:
              //     [{
              //       state: 'ProductOrderFail',
              //       productNo,
              //       productName,
              //       userEmail,
              //       price,
              //       deliveryFee,
              //     }]
              result: `ProductOrderFail ${productNo}`
            })
          })

        }else {

          return res.json({
            code: 200,
            // rows:
            //     [{
            //       state: 'ProductOrderEnd',
            //       productNo,
            //       productName,
            //       userEmail,
            //       price,
            //       deliveryFee,
            //       cnt
            //     }]
            result: `ProductOrderEnd ${productNo}`
          })
        }

      })
    } catch (error) {
      console.error(error);
    }

  }, 3000);
  return;
};