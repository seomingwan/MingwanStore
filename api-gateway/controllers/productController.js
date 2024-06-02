const httpProxy = require('http-proxy');

const options = {
  changeOrigin: true,
  target: {
      https: true
  }
}

const proxy = httpProxy.createProxyServer(options);

// 상품 리스트
exports.productList = async (req, res, next) => 
{
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res, { target: 'http://product-api:3000'}, function (error) {
    console.log("Proxy Error ", error)
  });
}

// 상품 상세보기
exports.productOne = (req, res, next) => 
{
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res, { target: 'http://product-api:3000'}, function (error) {
    console.log("Proxy Error ", error)
  });

};