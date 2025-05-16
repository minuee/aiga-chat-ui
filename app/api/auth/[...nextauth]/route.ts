import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
const authOptions: any = {
  providers: [
    CredentialsProvider({
      id: "aiga_credentials",
      name : "Aiga Credentials",
      credentials: {
        user_email: { label: "Email", type: "email" },
        user_password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
          body : JSON.stringify({
            ...credentials
          }),
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        })
        // 여기 주목!!! 서버에서 에러가 발생할 때 그 에러 내용이 서버에 담겨 있을 겁니다.
        if (authResponse.ok) {
          const user = await authResponse.json();
          // id, name, image, email만 허용
          if (authResponse?.ok && user) {
            return {
              id: user.id,
              email: credentials?.user_email
            }
          }
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID as string,
      clientSecret: process.env.NAVER_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: 'jwt', // JSON Web Token 사용
    maxAge: 60 * 60 * 24 // 세션 만료 시간(sec)
  },
  pages: {
    signIn: '/chat', // Default: '/auth/signin'
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
   /*  signIn: async ({ account , user}: { account: any, user: any }) => {
      if (account?.provider === 'credentials') {
        // <사용자 확인 후 회원가입 또는 로그인...>
        if ( user?.user_email ) {
          return true;
        }else{
          return false;
        }
      }
      return true;
    }, */
    jwt: async ({ token, user } : { token: JWT, user: any }) => {
      if (user?.accessToken) {
        token.accessToken = user.accessToken
      }
      return token
    },
    session: async ({ session, token } : { session: Session, token: JWT }) => {
      if (token?.accessToken) {
        session.accessToken = token.accessToken
      }else{
        return false;
        /* (session as any) = {
          accessToken: null,
          expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
          user: {
            id: `guestID_${new Date(Date.now() + 1000 * 60 * 60).getTime()}`,
            nickname: `guestName_${new Date(Date.now() + 1000 * 60 * 60).getTime()}`,
            email:`guestEmail_${new Date(Date.now() + 1000 * 60 * 60).getTime()}`,
          }
        } */
      }
      return session
    },
    redirect: async ({ url, baseUrl } : { url: string, baseUrl: string }) => {
      return baseUrl;
      /* if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url) {
        const { search, origin } = new URL(url);
        const callbackUrl = new URLSearchParams(search).get('callbackUrl');
        if (callbackUrl) {
          return callbackUrl.startsWith('/')
            ? `${baseUrl}${callbackUrl}`
            : callbackUrl;
        }
        if (origin === baseUrl) return url;
      }
      return baseUrl; */
    }
    /* redirect: async ({ url, baseUrl } : { url: string, baseUrl: string }) => {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (url) {
        const { search, origin } = new URL(url)
        const callbackUrl = new URLSearchParams(search).get('callbackUrl')
        if (callbackUrl)
          return callbackUrl.startsWith('/')
            ? `${baseUrl}${callbackUrl}`
            : callbackUrl
        if (origin === baseUrl) return url
      }
      return baseUrl
    } */
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST};