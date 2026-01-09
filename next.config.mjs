import createNextIntlPlugin from "next-intl/plugin"
//import runtimeCaching from 'next-pwa/cache.js'; // 이 부분은 이미 수정된 상태입니다.
import withPWAInit from 'next-pwa'; // 수정된 부분
//import runtimeCaching from "next-pwa/cache";

const withNextIntl = createNextIntlPlugin();

/* const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  customWorkerDir: 'worker',
  runtimeCaching,
}); */
const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  //disable: process.env.NODE_ENV !== "production",
  //runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/,/app-build-manifest.json$/]
});

const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  reactStrictMode: false, // changed this to false
  /* 다국어버전 */
  images: {
    domains: [
      'images.unsplash.com',
      'i.ibb.co',
      'scontent.fotp8-1.fna.fbcdn.net',
      'seoul.hyumc.com',
    ],
    // Make ENV
    unoptimized: true,
  }
};
//export default withNextIntl(nextConfig)
export default withPWA(withNextIntl(nextConfig))