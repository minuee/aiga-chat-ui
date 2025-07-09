import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  
  return {
    name: 'AIGA 의사 추천',
    short_name: 'AIGA',
    description: 'AIGA 의사 추천 ',
    id:"/ko",
    start_url: '/ko',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/img/fav/Icon-55.png',
        sizes: '55x55',
        type: 'image/png',
      },
      {
        src: '/img/fav/Icon-100.png',
        sizes: '100x100',
        type: 'image/png',
      },
      {
        src: '/img/fav/Icon-128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/img/fav/Icon-152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: '/img/fav/Icon-196.png',
        sizes: '196x196',
        type: 'image/png',
      },
      {
        src: '/img/fav/Icon-256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/img/fav/Icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      
    ],
  }
}