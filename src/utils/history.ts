// history.ts
import { createBrowserHistory } from 'history';

let browserHistory: ReturnType<typeof createBrowserHistory> | null = null;

if (typeof window !== 'undefined') {
  browserHistory = createBrowserHistory();
}

export enum HISTORY_ACTION_TYPE {
  POP = 'POP',
  PUSH = 'PUSH',
  REPLACE = 'REPLACE',
}

export function push(targetUrl: string) {
  browserHistory?.push(targetUrl);
}

export function redirect(targetUrl: string) {
  browserHistory?.replace(targetUrl);
}

export function reload() {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

export default browserHistory;
