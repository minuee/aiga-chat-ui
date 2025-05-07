'use client';
 
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <body style={{ textAlign: "center", padding: "50px" }}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link href="/" style={{ textDecoration: "none", color: "blue" }}>
          🔙 Go to Home
        </Link>
      </body>
    </html>
  );
}