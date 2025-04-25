// app/api/sendpush/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import webPush from 'web-push';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY;

webPush.setVapidDetails('mailto:minuee@kormedi.com', publicVapidKey, privateVapidKey);

export async function POST(req: Request) {
  try {
    console.log('Public Vapid Key:', publicVapidKey);
    console.log('Private Vapid Key:', privateVapidKey);
    const body = await req.json(); // 요청 본문을 JSON으로 파싱합니다.
    console.log(`req.body: ${JSON.stringify(body)}`);
    const subscription = body; // 구독 정보를 가져옵니다.
    const notificationPayload = {
      title: 'Hello from PWA',
      body: 'This is a test push notification',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
    };


    console.log(notificationPayload);
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