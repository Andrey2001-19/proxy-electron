const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  '/',
  createProxyMiddleware({
    changeOrigin: true,
    secure: false,

    // Aquí se ignora el target base porque usaremos `router`
    target: 'http://example.com',

    router: (req) => {
      const rawUrl = req.url?.substring(1); // quitar la barra inicial
      try {
        const parsed = new URL(rawUrl);
        console.log(`🔁 Redirigiendo a: ${parsed.origin}`);
        return parsed.origin;
      } catch (err) {
        console.error('❌ URL inválida:', rawUrl);
        return null;
      }
    },

    pathRewrite: (path, req) => {
      const rawUrl = req.url?.substring(1);
      const match = rawUrl?.match(/^https?:\/\/[^/]+(\/.*)?$/);
      return match?.[1] || '/';
    },

    onError: (err, req, res) => {
      console.error('❌ Proxy error:', err);
      res.status(500).send('Proxy error');
    },
  })
);

app.listen(PORT, () => {
  console.log(`✅ Proxy corriendo en puerto ${PORT}`);
});
