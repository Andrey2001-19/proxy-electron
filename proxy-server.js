// proxy-server.js
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

app.use('/', createProxyMiddleware({
  target: '', // Dinámico, lo extraemos del path
  changeOrigin: true,
  router: (req) => {
    const fullUrl = new URL(req.url.slice(1));
    return fullUrl.origin;
  },
  pathRewrite: (path, req) => {
    const fullUrl = new URL(req.url.slice(1));
    return fullUrl.pathname + fullUrl.search;
  }
}));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Proxy corriendo en puerto ${PORT}`);
});
