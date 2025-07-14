self.addEventListener("install", function () {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", function () {
    console.log("fcm sw activate..");
  });

  self.addEventListener('push', (event) => {
    let payload = {};
    try {
      payload = event.data?.json() || {};
    } catch (e) {
      console.warn('푸시 payload 없음, 기본 알림 사용');
      payload = {
        title: '기본 푸시 제목',
        body: '기본 메시지입니다.',
      };
    }
  
    const title = payload.title || '알림';
    const options = {
      body: payload.body || '내용 없음',
      icon: '/img/fav/Icon-196.png',
      badge: '/img/fav/Icon-72.png',
      data: {
        url: payload.data?.url || '/',
      },
    };
   
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data.url || '/';  // url 프로퍼티 명확히
    event.waitUntil(self.clients.openWindow(urlToOpen));
  });