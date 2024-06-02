const httpProxy = require('http-proxy');

const options = {
  changeOrigin: true,
  target: {
      https: true
  }
}

const proxy = httpProxy.createProxyServer(options);

// 롤백 기록
exports.rollbackRecord = async (req, res, next) => 
{
  proxy.on('proxyReq', (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res, { target: 'http://anomaly-detection:3335'}, function (error) {
    console.log("Proxy Error ", error)
  });
  
}
