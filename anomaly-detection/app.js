const express = require('express');
const cors = require('cors')

const rollbackRouter = require('./routes/rollbackRouter');

const winston = require('winston');
const expressWinston = require('express-winston');
const winstonDaily = require('winston-daily-rotate-file')
const logDir = 'logs';  // logs 디렉토리 하위에 로그 파일 저장
const mt = require('moment-timezone');
const date = mt().tz('Asia/Seoul'); // NOTE: 날짜는 한국 시간으로 하고 싶다.

const app = express();

const server = async () => 
{
    app.use(cors({
        origin: "*", // 접근 권한을 부여하는 도메인
        credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
        optionsSuccessStatus: 200, // 응답 상태 200으로 설정
    }));
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(expressWinston.logger({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf((info) => {
            // console.log('res', JSON.stringify(info.meta.res));
    
            // return `${date.format()} ${JSON.stringify(info.meta.res.body)}`;
            
            return `${info.meta.res.body.result}`;          
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

    app.use('/manage', rollbackRouter);
    
    app.listen(3335, () => 
    {
        console.log(`백엔드 서버 ${3335}번 포트에서 작동중.`)
    })

}

server();