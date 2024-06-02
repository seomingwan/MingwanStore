const express = require('express');

const masterRouter = require('./routes/masterRouter');

const app = express();

const server = async () => 
{
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/manage', masterRouter);

  app.listen(3334, () => 
  {
      console.log(`백엔드 서버 ${3334}번 포트에서 작동중.`)
  })

}

server();