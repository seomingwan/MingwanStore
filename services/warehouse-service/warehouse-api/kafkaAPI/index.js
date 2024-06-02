const mysql      = require('mysql');
const dbconfig   = require('../config/mysqlDatabase');
const connection = mysql.createConnection(dbconfig);

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka-1:9092', 'kafka-2:9093', 'kafka-3:9094']
})
  
const consumer = kafka.consumer({ groupId: 'test-group2' })

module.exports = async () => { 
  await consumer.connect()
  await consumer.subscribe({ topic: 'product-order', fromBeginning: true })
  await consumer.subscribe({ topic: 'product-order-rollback', fromBeginning: true })
  await consumer.subscribe({ topic: 'product-register', fromBeginning: true })
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      let result = JSON.parse(message.value);

      let name = result.name;
      let typeName = result.typeName;
      let price = result.price;
      let count = result.count;
      let deliveryFee = result.deliveryFee;

      let productName = result.productName
      let cnt = result.cnt;

      switch (message.key.toString()) {
        case 'product':

          try {
            connection.query(`insert into productstock(name, typeName, price, count, deliveryFee) values('${name}', '${typeName}', '${price}', '${count}', '${deliveryFee}')`, async (error, rows) => {
              if(error) throw error;

            })
          } catch (error) {
            console.error(error);
          }
          
          break;
        case 'order':
          
          try {
            connection.query(`update productstock set count = count - '${cnt}' where name = '${productName}'`, async (error, rows) => {
              if(error) throw error;

            })
          } catch (error) {
            console.error(error);
          }
          
          break;

        case 'orderRollback':
          
          try {
            connection.query(`update productstock set count = count + '${cnt}' where name = '${productName}'`, async (error, rows) => {
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