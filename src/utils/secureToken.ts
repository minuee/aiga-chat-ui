// utils/secureToken.ts
const CryptoJS = require('crypto-js'); // ✅ CommonJS 스타일로 불러오기

// 암호화
export function encryptToken(token: string): string {
    const SECRET_KEY = process.env.NEXT_PUBLIC_AUTH_SECRET;
    console.log("apidata SECRET_KEY",SECRET_KEY)
    console.log("apidata encryptToken",token)
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
}

// 복호화
export function decryptToken(token: string): string | null {
    try {
        const SECRET_KEY = process.env.NEXT_PUBLIC_AUTH_SECRET;
        const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY);
        return bytes?.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error('복호화 실패:', e);
        return null;
    }
}