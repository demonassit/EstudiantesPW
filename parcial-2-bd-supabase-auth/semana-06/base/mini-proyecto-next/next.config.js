// Proxy de desarrollo: el navegador solo habla con Next (puerto 3000) y Next reenvía
// la petición al servidor Express. Así no hay problemas de CORS ni de cookies entre puertos.
const MINI_SERVIDOR_URL = process.env.MINI_SERVIDOR_URL || 'http://localhost:4000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Mini-servidor Express de las semanas 6-7: /mini/... -> MINI_SERVIDOR_URL/...
      { source: '/mini/:path*', destination: `${MINI_SERVIDOR_URL}/:path*` },
      // Backend del proyecto (desde la semana 8): /api/... -> BACKEND_URL/api/...
      { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
    ];
  },
};
