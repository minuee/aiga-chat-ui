
import AppWrappers from '@/components/layout/AppWrappers';
import NotFoundView from "@/components/view/NotFound";
import {NextIntlClientProvider} from 'next-intl';
import { subMetadata } from '@/components/header/SubHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  ...subMetadata,
  title: {
    default: 'AIGA',
    template: '%s',
  },
  description: 'AIGA 의사 추천 서비스',
  icons: {
    icon: '/img/fav/Icon-512.png',
  },
}

export default function GlobalNotFound() {
  /* return (
    <html lang="ko">
      <body style={{ textAlign: "center", padding: "50px" }}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link href="/" style={{ textDecoration: "none", color: "blue" }}>
          🔙 Go to Home
        </Link>
      </body>
    </html>
  ); */
  return (
    <html lang="ko">
      <body>
        <NextIntlClientProvider>
          <AppWrappers>
            <NotFoundView />
          </AppWrappers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
