const httpProxy = require('http-proxy');

const options = {
  changeOrigin: true,
  target: {
      https: true
  }
}

const proxy = httpProxy.createProxyServer(options);

// 상품 등록
exports.productRegister = async (req, res, next) => 
{
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res, { target: 'http://master-api:3334'}, function (error) {
    console.log("Proxy Error ", error)
  });
  
}