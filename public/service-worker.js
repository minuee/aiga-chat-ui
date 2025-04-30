self.addEventListener("install", function () {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", function () {
    console.log("fcm sw activate..");
  });

  self.addEventListener('push', (event) => {
    const payload = event.data.text();
    const options = {
      body: payload,
      icon: 'img/icon.png',
      badge: 'img/badge.png',
      vibrate: [200, 100, 200],
      data: {
        url: 'https://kormedi.com',
      },
    };
    event.waitUntil(self.registration.showNotification('푸시 알림', options));
  });
  
  self.addEventListener("notificationclick", (event) => {
    console.log("notificationclick",event.notification.data);
    event.notification.close();
    const urlToOpen = event.notification.data;
    event.waitUntil(self.clients.openWindow(urlToOpen));
  });