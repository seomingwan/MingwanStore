const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka-1:9092', 'kafka-2:9093', 'kafka-3:9094']
})

const producer = kafka.producer()

// 상품 등록
exports.productRegister = async (req, res, next) => 
{
  await producer.connect()

  await producer.send({
    topic: 'product-register',
    messages: [
      { key: 'product', value: JSON.stringify(req.body) },
    ],
  })

  return res.json({
    code: 200,
    message: 'successful',
  });
  
}