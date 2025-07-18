import { create } from "zustand";
import { devtools, persist,createJSONStorage } from 'zustand/middleware'
import * as Cookies from '@/utils/cookies';
import { UserData } from "@/types/userData"
import { encryptToken } from "@/utils/secureToken";
//import encryptedStorage from './encryptedStorage';
interface UserInfoState {
  userStoreInfo : any;
  setUserBasicInfo: (data: any) => void;
  resetUserBasicInfo: () => void; // 👈 추가
}

export const UserBasicInfoStore = create<UserInfoState>()(
  devtools(
      persist(
          (set) => ({
            userStoreInfo: null,
            setUserBasicInfo: async(userBasicInfo: any) => {
              set({ userStoreInfo: userBasicInfo }); // ✅ 문자열을 상태의 특정 필드에 저장
            },
            resetUserBasicInfo: async() => {
              const resetData = {
                isState: false,
                sns_id: '',
                email: '',
                profileImage: '',
                agreement: false,
                registDate: '',
                unregistDate: '',
                updatedDate: '',
                userId: 'Guest',
                isGuest: true,
                joinType: '',
                nickName: '',
                userMaxToken: 0,
                userRetryLimitSec: 0,
              };
    
              const encrypted = await encryptToken(JSON.stringify(resetData));
              set({ userStoreInfo: encrypted }); // ✅ 암호화된 문자열을 상태에 저장
            },
          }),
          { 
              name: 'UserBasicInfoStore',
              storage: createJSONStorage(() => localStorage)
          }
      )
  )
);

const useUserStateStore = create<UserData>()(
    devtools(
      persist(
        (set) => ({
          isState: false,
          sns_id: '',
          email: '',
          profileImage: '',
          agreement: false,
          registDate: '',
          unregistDate: '',
          updatedDate: '',
          userId: '',
          isGuest: true,
          joinType: '',
          nickName: '',
          userMaxToken: 0,
          userRetryLimitSec: 0,
          // ✅ 개선된 setUserState
          setUserState: (data) => {
            set((state) => {
              const newState = { ...state, ...data };
              const expireDate = new Date();  
              expireDate.setDate(expireDate.getDate() + 365); // 365일 후 만료
              if (newState.isState) {
                Cookies.setCookie('LoginUser', encryptToken(JSON.stringify(newState)), { path: '/' , expires : expireDate }  , );
              }
              return newState;
            });
          },
          // 👇 로그아웃용 초기화 함수
          resetUserState: () => {
            set(() => {
              Cookies.removeCookie('LoginUser');
              return {
                isState: false,
                sns_id: '',
                email: '',
                profileImage: '',
                agreement: false,
                registDate: '',
                unregistDate: '',
                updatedDate: '',
                userId: 'Guest',
                isGuest: true,
                joinType: '',
                nickName: '',
                userMaxToken: 0,
                userRetryLimitSec: 0,
              };
            });
          }
        }),
        { 
          name: 'UserStateStore',
        }
      )
    )
);


interface PWATokenStoreState {
  userPWAPermission : boolean;
  userPWAToken: any; // ✅ 추가
  setUserPWATokenInfo: (userPWAPermission: boolean,userPWAToken :any) => void;
}

export const PWATokenStore = create<PWATokenStoreState>()(
  devtools(
      persist(
          (set) => ({
              userPWAPermission: false,
              userPWAToken: null, // ✅ 추가
              setUserPWATokenInfo: (userPWAPermission:boolean,userPWAToken :any ) => {
                  set({userPWAPermission, userPWAToken});
              },
              hasHydrated: false,
          }),
          { 
              name: 'PWATokenStore',
              storage: createJSONStorage(() => localStorage),
              onRehydrateStorage: () => (state:any) => {
                  state?.set({ hasHydrated: true });
              }
          }
      )
  )
);

export default useUserStateStore;
