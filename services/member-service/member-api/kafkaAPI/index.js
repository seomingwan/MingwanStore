const mysql      = require('mysql');
const dbconfig   = require('../config/mysqlDatabase');
const connection = mysql.createConnection(dbconfig);

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka-1:9092', 'kafka-2:9093', 'kafka-3:9094']
})
  
const consumer = kafka.consumer({ groupId: 'test-group1' })

module.exports = async () => { 
  await consumer.connect()
  await consumer.subscribe({ topic: 'product-order', fromBeginning: true })
  await consumer.subscribe({ topic: 'product-order-rollback', fromBeginning: true })
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      let result = JSON.parse(message.value);
      
      let userEmail = result.userEmail;
      let point = result.point;

      switch (message.key.toString()) {
        case 'order':

          try {
            connection.query(`update users set point = point + '${point}' where email = '${userEmail}'`, async (error, rows) => {
              if(error) throw error;

            })
          } catch (error) {
            console.error(error);
          }
          
          break;
      
        case 'orderRollback':

          try {
            connection.query(`update users set point = point - '${point}' where email = '${userEmail}'`, async (error, rows) => {
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