const express = require('express');

const productRouter = require('./routes/productRouter');

const kafkaAPI = require('./kafkaAPI');

const winston = require('winston');
const expressWinston = require('express-winston');
const winstonDaily = require('winston-daily-rotate-file')
const logDir = 'logs';  // logs 디렉토리 하위에 로그 파일 저장
const mt = require('moment-timezone');
const date = mt().tz('Asia/Seoul'); // NOTE: 날짜는 한국 시간으로 하고 싶다.

const app = express();

const server = async () => 
{
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(expressWinston.logger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) => {
        // console.log('res', JSON.stringify(info.meta.res));

        if(String(info.message).includes('productOne')){

          // return `${date.format()} productOne ${JSON.stringify(info.meta.res.body)}`;
          
          return `productOne ${info.meta.res.body.rows[0].no}`;
        }
        
        return ''
      })
    ),
    transports: [
      new winstonDaily({
        level: 'info',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir+'/info',
        filename: `%DATE%.log`,
        maxSize: "20m",
        maxFiles: 30,  // 30일치 로그 파일 저장
        zippedArchive: true, 
      }),
    ],

    responseWhitelist: [...expressWinston.responseWhitelist, 'body']
  }));

  app.use('/manage', productRouter);

  kafkaAPI();
  
  app.listen(3000, () => 
  {
      console.log(`백엔드 서버 ${3000}번 포트에서 작동중.`)
  })

}

server();