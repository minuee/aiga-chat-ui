import { decryptToken,encryptToken } from "@/utils/secureToken";

// encryptedStorage.ts
const encryptedStorage = {

    getItem: (name: string) => {
      const encrypted = localStorage.getItem(name);
      console.log("getItem value", encrypted);
      return encrypted;
      if (!encrypted) return null;
      try {
        //const decrypted = decryptToken(encrypted);
        //console.log("getItem decrypted ", decrypted);
        return encrypted; // string 타입 반환
      } catch (e:any) {
        console.log("encryptedStorage e", e);
        return null;
      }
    },
    setItem: (name: string, value: any) => {
      console.log("encryptedStorage value",name, value)
      console.log("encryptedStorage value 333",name, value?.state?.userStoreInfo)
      try {
        localStorage.setItem(name, value?.state?.userStoreInfo);
      } catch(e:any) {
        console.log("encryptedStorage e",e)
      }
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  };
  
  export default encryptedStorage;
  