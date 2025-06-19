// crypto-util.ts
import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';
import { utf8ToBytes, bytesToHex, hexToBytes } from '@noble/hashes/utils';

const iterations = 100_000;
const keyLength = 32; // 256-bit

const salt = utf8ToBytes('static-salt');

function deriveKey(password: string): Uint8Array {
    return pbkdf2(sha256, utf8ToBytes(password), salt, { c: iterations, dkLen: keyLength });
}

function xor(data: Uint8Array, key: Uint8Array): Uint8Array {
    return data.map((byte, i) => byte ^ key[i % key.length]);
}

export function encryptToken(token: string,): string {
    const SECRET_KEY = process.env.NEXT_PUBLIC_AUTH_SECRET ?  process.env.NEXT_PUBLIC_AUTH_SECRET : "";
    const key = deriveKey(SECRET_KEY);
    const data = utf8ToBytes(token);
    const encrypted = xor(data, key);
    return bytesToHex(encrypted);
}

export function decryptToken(token: string): string {
    const SECRET_KEY = process.env.NEXT_PUBLIC_AUTH_SECRET ?  process.env.NEXT_PUBLIC_AUTH_SECRET : "";
    const key = deriveKey(SECRET_KEY);
    const data = xor(hexToBytes(token), key);
    return new TextDecoder().decode(data);
}
