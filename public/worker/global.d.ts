// app/worker/global.d.ts
interface ServiceWorkerGlobalScope extends Window {
    registration: ServiceWorkerRegistration;
    clients: Clients;
    addEventListener(type: 'push', listener: (event: PushEvent) => void): void;
    addEventListener(type: 'notificationclick', listener: (event: NotificationEvent) => void): void;
    addEventListener(type: 'install', listener: (event: Event) => void): void;
    skipWaiting(): Promise<void>;
}

// Clients 인터페이스 추가
interface Clients {
    openWindow(url: string): Promise<WindowClient | null>;
    // 필요한 다른 메서드를 추가할 수 있습니다.
}

interface PushEvent extends Event {
    data?: PushMessageData;
    waitUntil(promise: Promise<any>): void;
}

interface NotificationEvent extends Event {
    notification: Notification;
}

declare module 'web-push';