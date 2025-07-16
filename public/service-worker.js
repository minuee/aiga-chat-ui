self.addEventListener("install", function () {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", function () {
    console.log("fcm sw activate..");
  });

  self.addEventListener('push', (event) => {
    let payload = {};
    /* if (event.data) {
      console.log('푸시 payload:', event.data.text());
    } else {
      console.warn('푸시 데이터 없음');
    } */
    try {
      payload = event.data?.json() || {};
      //console.warn('푸시 payload 있음',payload);
    } catch (e) {
      //console.warn('푸시 payload 없음, 기본 알림 사용');
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
    //console.log('푸시 payload ',payload);
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

         // 탭이 안 열려 있으면 알림 띄움
         await self.registration.showNotification(payload.title, {
          body: payload.body,
          icon: '/img/fav/Icon-196.png',
          badge: '/img/fav/Icon-72.png',
          data: {
            url: payload.data?.url || 'https://aigadev.kormedi.com'
          },
          requireInteraction: true
        });

        /* const clients = await self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true,
        });
        
        console.log('푸시 이벤트 clients',clients);
        if (clients.length > 0) {
          // 탭이 열려있으면 메시지로 전달만 하고 알림은 안 띄움
          clients[0].postMessage(payload);
          return;
        } */
        
       
      })()
    );
  });
  
 
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
  
    const urlToOpen = event.notification.data?.url || '/';
  
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(urlToOpen);
      })
    );
  });
  