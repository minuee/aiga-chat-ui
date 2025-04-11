import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AIGA Chatbot',
    short_name: 'AIGAPWA',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '../public/img/logo.png',
        sizes: '555x149',
        type: 'image/png',
      },
      {
        src: '../public/img/logo.png',
        sizes: '555x149',
        type: 'image/png',
      },
    ],
  }
}