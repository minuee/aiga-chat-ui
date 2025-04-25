// app/worker/index.ts
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Received.', event.data?.text());
    const { title, body } = event.data?.json() || { title: '', body: '' };
    
    // showNotification의 반환값을 waitUntil에 전달
    event.waitUntil(
        self.registration.showNotification(title, { body })
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] notificationclick');
    event.notification.data?.link && self.clients.openWindow(event.notification.data.link);
});

self.addEventListener('install', () => {
    console.log('[Service Worker] install');
    self.skipWaiting();
});