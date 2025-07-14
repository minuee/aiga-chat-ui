self.addEventListener("install", function () {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", function () {
    console.log("fcm sw activate..");
  });

  self.addEventListener('push', (event) => {
    const payload = event.data.json();
    const options = {
      body: payload.body,
      icon: payload.icon || '/img/fav/Icon-196.png',
      badge: payload.badge || '/img/fav/Icon-72.png',
      vibrate: [200, 100, 200],
      data: {
        url: payload.data?.url || 'https://aigadev.kormedi.com/ko/chat',
      },
    };
    event.waitUntil(self.registration.showNotification('푸시 알림', options));
  });
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data.url || '/';  // url 프로퍼티 명확히
    event.waitUntil(self.clients.openWindow(urlToOpen));
  });