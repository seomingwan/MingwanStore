const mysql      = require('mysql');
const dbconfig   = require('../config/orderDatabase');
const connection = mysql.createConnection(dbconfig);

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka-1:9092', 'kafka-2:9093', 'kafka-3:9094']
})

const producer = kafka.producer()

// 상품 주문
exports.productOrder = async (req, res, next) => 
{
  await producer.connect()

  await producer.send({
    topic: 'product-order',
    messages: [
      { key: 'order', value: JSON.stringify(req.body) },
    ],
  })

  return res.json({
    code: 200,
    rows: JSON.stringify(req.body),
  });
}

// 주문 내역
exports.orderList = (req, res, next) => 
{
  const { userEmail } = req.body;

  try {
    connection.query(`select * from orderList where userEmail = '${userEmail}'`, async (error, rows) => {
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