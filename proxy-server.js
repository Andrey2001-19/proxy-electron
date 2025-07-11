const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  '/',
  createProxyMiddleware({
    changeOrigin: true,
    secure: false,
    target: 'http://example.com', // este valor se sobrescribe por router()
    router: (req) => {
      const rawUrl = req.url?.substring(1); // elimina el "/" inicial
      try {
        const finalUrl = new URL(rawUrl);
        return finalUrl.origin;
      } catch (err) {
        console.error('❌ Error al construir la URL:', err.message);
        return null;
      }
    },
    pathRewrite: (path, req) => {
      const url = req.url?.substring(1);
      const pathOnly = url?.replace(/^https?:\/\/[^/]+/, '');
      return pathOnly || '/';
    },
    onError: (err, req, res) => {
      console.error('❌ Proxy error:', err);
      res.status(500).send('Proxy error');
    },
  })
);

app.listen(PORT, () => {
  console.log(`Proxy corriendo en puerto ${PORT}`);
});

