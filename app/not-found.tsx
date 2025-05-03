'use client';
 
import Error from 'next/error';
import Link from 'next/link';

// -------------------------
// 이런 식으로 커스텀 할 수도 있어요
// -------------------------
export default function GlobalNotFound() {
  return (
    <html lang="en">
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