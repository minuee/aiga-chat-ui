import CryptoJS from 'crypto-js';

const key = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;
const iv = process.env.NEXT_PUBLIC_CRYPTO_IV;

// Asegúrate de que las variables de entorno estén configuradas.
if (!key || !iv) {
  throw new Error(
    'NEXT_PUBLIC_CRYPTO_SECRET_KEY and NEXT_PUBLIC_CRYPTO_IV must be set in environment variables.',
  );
}

// Parsea la clave y el IV al formato que crypto-js puede utilizar.
const parsedKey = CryptoJS.enc.Utf8.parse(key);
const parsedIv = CryptoJS.enc.Utf8.parse(iv);

/**
 * Descifra una cadena hexadecimal cifrada desde el servidor y la devuelve como un objeto JSON.
 * @param encryptedHex El dato cifrado recibido del servidor.
 * @returns El objeto JSON descifrado y parseado.
 */
export const decryptResponse = (encryptedHex: string): any => {
  try {
    // Convierte la cadena hexadecimal a un formato CipherParams de crypto-js.
    const encryptedData = CryptoJS.enc.Hex.parse(encryptedHex);

    // Descifra los datos.
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedData } as CryptoJS.lib.CipherParams,
      parsedKey,
      {
        iv: parsedIv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    // Convierte los datos descifrados a una cadena UTF-8.
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error('Decryption resulted in an empty string.');
    }

    // Parsea la cadena a un objeto JSON y lo devuelve.
    return JSON.parse(decryptedString);

  } catch (error) {
    console.error('Failed to decrypt response:', error);
    // Devuelve null en caso de error para evitar que la aplicación se bloquee.
    return null;
  }
};
