const mysql = require('mysql');

const dbconfig1 = require('../config/orderDatabase');
const orderConnection = mysql.createConnection(dbconfig1);

const dbconfig2 = require('../config/warehouseDatabase');
const warehouseConnection = mysql.createConnection(dbconfig2);

const dbconfig3 = require('../config/anormalyDetectionDatabase');
const anormalyDetectionConnection = mysql.createConnection(dbconfig3);

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka-1:9092', 'kafka-2:9093', 'kafka-3:9094']
})
  
const consumer = kafka.consumer({ groupId: 'test-group4' })

const producer = kafka.producer()

module.exports = async (req, res, next) => { 
  await consumer.connect()
  await consumer.subscribe({ topic: 'product-order', fromBeginning: true })
  await consumer.subscribe({ topic: 'product-order-rollback', fromBeginning: true })
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      let result = JSON.parse(message.value);
      
      let productNo = result.productNo
      let productName = result.productName
      let userEmail = result.userEmail;
      let price = result.price;
      let cnt = result.cnt;
      let deliveryFee = result.deliveryFee;
      let point = result.point;

      switch (message.key.toString()) {
        case 'order':
          setTimeout(() => {
            try 
            {
              warehouseConnection.query(`select count from productstock where no='${productNo}'`, async (error, rows) => 
              {
                if(error) throw error;
  
                console.log('남은 수량 : ' + rows[0].count)
                
                if(rows[0].count < 0)
                {
                  const arr = {
                    productNo,
                    productName,
                    userEmail,
                    price,
                    cnt,
                    deliveryFee,
                    point,
                  }
  
                  await producer.connect()
                  await producer.send({
                    topic: 'product-order-rollback',
                    messages: [
                      { key: 'orderRollback', value: JSON.stringify(arr) },
                    ],
                  })
  
                }else{
                  orderConnection.query(`insert into orderList(productNo, productName, userEmail, price, count, deliveryFee) values('${productNo}', '${productName}', '${userEmail}', '${price}', '${cnt}','${deliveryFee}')`, async (error, rows) => {
                    if(error) throw error;
    
                  })
                }
  
              })
            } 
            catch (error) 
            {
              console.error(error);
              return next(error);
            }
            
          }, 1000);

          break;
        
        case 'orderRollback':

          try {
            anormalyDetectionConnection.query(`insert into rollbackRecord(productNo, productName, userEmail, price, count, deliveryFee) values('${productNo}', '${productName}', '${userEmail}', '${price}', '${cnt}','${deliveryFee}')`, async (error, rows) => {
              if(error) throw error;

            })
          } catch (error) {
            console.error(error);
          }

          break;

        default:
          break;
      }
    },
  })
}