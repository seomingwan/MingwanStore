const mysql      = require('mysql');
const dbconfig   = require('../config/mysqlDatabase');
const connection = mysql.createConnection(dbconfig);

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka-1:9092', 'kafka-2:9093', 'kafka-3:9094']
})
  
const consumer = kafka.consumer({ groupId: 'test-group3' })

module.exports = async (req, res, next) => { 
  await consumer.connect()
  await consumer.subscribe({ topic: 'product-register', fromBeginning: true })
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      switch (message.key.toString()) {
        case 'product':
          let result = JSON.parse(message.value);

          let imageName = result.imageName
          let name = result.name;
          let typeName = result.typeName;
          let price = result.price;
          let deliveryFee = result.deliveryFee;

          try {
            connection.query(`insert into product(image, name, typeName, price, deliveryFee) values('${imageName}', '${name}', '${typeName}', '${price}', '${deliveryFee}')`, async (error, rows) => {
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