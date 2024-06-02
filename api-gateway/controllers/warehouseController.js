const httpProxy = require('http-proxy');

const options = {
  changeOrigin: true,
  target: {
      https: true
  }
}

const proxy = httpProxy.createProxyServer(options);

// 창고 보관 물품 리스트
exports.getWarehouseList = async (req, res, next) => 
{
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res, { target: 'http://warehouse-api:3010'}, function (error) {
    console.log("Proxy Error ", error)
  });
}
