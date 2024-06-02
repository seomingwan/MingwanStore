const express = require('express');
const cors = require('cors')

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const logger =  require('./winston'); 

const dotenv = require('dotenv');

const memberRouter = require('./routes/memberRouter');
const productRouter = require('./routes/productRouter');
const orderRouter = require('./routes/orderRouter');
const warehouseRouter = require('./routes/warehouseRouter');
const masterRouter = require('./routes/masterRouter');
const anomalyDetectionRouter = require('./routes/anomalyDetectionRouter');

dotenv.config();

const app = express();

const server = async () => 
{
    app.use(cors({
        origin: "https://seomingwan.store", // 접근 권한을 부여하는 도메인
        credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
        optionsSuccessStatus: 200, // 응답 상태 200으로 설정
    }));

    app.use(express.urlencoded({    
      limit:"50mb",
      extended: false
    }));

    app.use(express.json({   
      limit : "50mb"
    }));

    app.use(morgan("combined", { stream: logger.stream }));

    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: false,
      },
    }));

    app.use('/apigateway/member', memberRouter);
    app.use('/apigateway/product', productRouter);
    app.use('/apigateway/order', orderRouter);
    app.use('/apigateway/warehouse', warehouseRouter);
    app.use('/apigateway/master', masterRouter);
    app.use('/apigateway/anormalyDetection', anomalyDetectionRouter);
    
    app.listen(8080, () => 
    {
        console.log(`백엔드 서버 ${8080}번 포트에서 작동중.`)
    })

}

server();