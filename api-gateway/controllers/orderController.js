const httpProxy = require('http-proxy');

const options = {
  changeOrigin: true,
  target: {
      https: true
  }
}

const proxy = httpProxy.createProxyServer(options);

// 상품 주문
exports.productOrder = async (req, res, next) => 
{
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res, { target: 'http://order-api:3333'}, function (error) {
    console.log("Proxy Error ", error)
  });
  
}

// 상품 주문
exports.orderList = async (req, res, next) => 
{
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res, { target: 'http://order-api:3333'}, function (error) {
    console.log("Proxy Error ", error)
  });
  
}
