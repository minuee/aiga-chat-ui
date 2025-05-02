const runtimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  customWorkerDir: 'worker',
  runtimeCaching,
});

const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  reactStrictMode: false, // changed this to false
  /* 다국어버전 */
  images: {
    domains: [
      'images.unsplash.com',
      'i.ibb.co',
      'scontent.fotp8-1.fna.fbcdn.net',
    ],
    // Make ENV
    unoptimized: true,
  },
};

module.exports = withPWA(nextConfig);

/*

runtimeCaching: PWA가 오프라인 작동을 지원하기 위해 캐싱해주는 역할
dest: 'public': 서비스 워커 파일과 관련된 파일들을 public 폴더에 저장
register: true: 서비스 워커를 자동으로 등록하도록 설정
skipWaiting: true: 새로운 서비스 워커가 설치되자마자 이전 버전의 서비스 워커를 대체하도록 설정. => 업데이트시 빠르게 적용됨
customWorkerDir: 'worker': 커스텀 서비스 워커 폴더를 지정

*/