import { decryptToken,encryptToken } from "@/utils/secureToken";

// encryptedStorage.ts
const encryptedStorage = {

    getItem: (name: string) => {
      const encrypted = localStorage.getItem(name);
      return encrypted;
    },
    setItem: (name: string, value: any) => {
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
  