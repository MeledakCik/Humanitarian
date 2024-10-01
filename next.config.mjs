import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://humanitarian1-rz-be-dev1.cnt.id/apid/:path*',
      },
    ];
  },
  // konfigurasi lain bisa ditambahkan di sini
};

export default withPWA(nextConfig);
