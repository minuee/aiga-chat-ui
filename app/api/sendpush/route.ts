// app/api/sendpush/route.ts

import webPush from 'web-push';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY;

webPush.setVapidDetails('mailto:minuee@kormedi.com', publicVapidKey, privateVapidKey);

export async function POST(req: Request) {

  try {
    
    const body = await req.json(); // 요청 본문을 JSON으로 파싱합니다.
    const subscription = body; // 구독 정보를 가져옵니다.
    const notificationPayload = {
      messageType: 'supplement',
      title: 'Hello from PWA',
      body: 'This is a test push notification',
      icon: '/img/push/196.png',
      badge: '/img/push/72.png',
      data: {
        url: 'https://kormedi.com',
      },
    };

    await webPush.sendNotification(subscription, JSON.stringify(notificationPayload));
    return new Response(JSON.stringify({ message: 'Push notification sent' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to send push notification' }), { status: 500 });
  }
}

/*
DEJN23AA55
RVZTBMAJTH
BRG7UJ8K5Y
C2FG7BETSY
9SK9BTGS86
XHNMVRQK6K
7FWB7WVRF6
VUKJ7EMVWH
3YH4BV8VED
6TQPREE7EW
*/