const express = require('express');

const userRouter = require('./routes/userRouter');

const kafkaAPI = require('./kafkaAPI');

const app = express();

const server = async () => 
{
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/manage', userRouter);

  kafkaAPI();
  
  app.listen(3010, () => 
  {
      console.log(`백엔드 서버 ${3010}번 포트에서 작동중.`)
  })

}

server();