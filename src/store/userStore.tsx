import { create } from "zustand";
import { devtools, persist,createJSONStorage } from 'zustand/middleware'
import * as Cookies from '@/utils/cookies';
import { UserData } from "@/types/userData"


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
              if (newState.isState) {
                Cookies.setCookie('LoginUser', JSON.stringify(newState));
              } else {
                Cookies.removeCookie('LoginUser');
              }
              return newState;
            });
          },
        }),
        { name: 'UserStateStore' }
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

/*

interface UserData {
    isState : boolean;
    sns_id: string,
    email: string,
    profileImage: string,
    agreement: false,
    registDate: any,
    unregistDate: any,
    updatedDate: any
    userId: string;
    isGuest:boolean;
    joinType:string;
    nickName : string;
    userMaxToken : number;
    userRetryLimitSec : number;
    setUserState: (
        isState : boolean,
        sns_id: string,
        email: string,
        profileImage: string,
        agreement: false,
        registDate: any,
        unregistDate: any,
        updatedDate: any,
        userId: string,
        isGuest:boolean,
        joinType:string,
        nickName : string,
        userMaxToken : number,
        userRetryLimitSec : number
    ) => void;
}

const UserStateStore = create<UserData>()(
    devtools(
        persist(
            (set) => ({
                isState : false,
                sns_id: '',
                email: '',
                profileImage: '',
                agreement: false,
                registDate: '',
                unregistDate: '',
                updatedDate: '',
                userId: '',
                isGuest:true,
                joinType:'',
                nickName : '',
                userMaxToken : 0,
                userRetryLimitSec : 0,
                setUserState: (isState,sns_id,email,profileImage,agreement,registDate,unregistDate,updatedDate, userId,isGuest,joinType,nickName,userMaxToken,userRetryLimitSec) => {
                    set((state) => ({isState,sns_id,email,profileImage,agreement,registDate,unregistDate,updatedDate, userId,isGuest,joinType,nickName,userMaxToken,userRetryLimitSec }));
                    if ( isState ) {
                        Cookies.setCookie('LoginUser',JSON.stringify({isState,sns_id,email,profileImage,agreement,registDate,unregistDate,updatedDate, userId,isGuest,joinType,nickName,userMaxToken,userRetryLimitSec}));
                    }else{
                        Cookies.removeCookie('LoginUser');
                    }
                },
            }),
            { name: 'UserStateStore' }
        )
    )
);

export default UserStateStore;
*/