self.addEventListener("install", function () {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", function () {
    console.log("fcm sw activate..");
  });

  self.addEventListener('push', (event) => {
    let payload = {};

    console.log('푸시 이벤트 수신됨');

    if (event.data) {
      console.log('푸시 payload:', event.data.text());
    } else {
      console.warn('푸시 데이터 없음');
    }
    try {
      payload = event.data?.json() || {};
    } catch (e) {
      console.warn('푸시 payload 없음, 기본 알림 사용');
      payload = {
        title: '기본 푸시 제목',
        body: '기본 메시지입니다.',
        icon: '/img/fav/Icon-196.png',
      badge: '/img/fav/Icon-72.png',
      data: {
        url: 'https://aigadev.kormedi.com',
      },
      };
    }
    console.log('푸시 payload ',payload);
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
      (async () => {
        const allClients = await clients.matchAll({ includeUncontrolled: true });
        for (const client of allClients) {
          console.log('푸시 client.postMessage ',payload);
          client.postMessage(payload); // 포그라운드에 메시지 전달
        }
  
        await self.registration.showNotification(payload.title, {
          body: payload.body,
          icon: '/img/fav/Icon-196.png',
        });
      })()
    );
  });
  
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data.url || '/';  // url 프로퍼티 명확히
    event.waitUntil(self.clients.openWindow(urlToOpen));
  });