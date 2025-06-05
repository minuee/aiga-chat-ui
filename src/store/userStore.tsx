import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'
import * as Cookies from '@/utils/cookies';
interface UserData {
    isState : boolean;
    userId: string;
    isGuest:boolean;
    joinType:string;
    nickName : string;
    userMaxToken : number;
    userRetryLimitSec : number;
    setUserState: (
        isState : boolean,
        userId: string,
        isGuest:boolean,
        joinType : string,
        nickName : string,
        userMaxToken : number,
        userRetryLimitSec : number
    ) => void;
}

const UserStateStore = create<UserData>()(
    devtools(
        persist(
            (set) => ({
                isState: false,
                userId: '',
                isGuest: true,
                joinType :'',
                nickName :'',
                userMaxToken : 0,
                userRetryLimitSec : 0,
                setUserState: (isState,userId,isGuest,joinType,nickName,userMaxToken,userRetryLimitSec) => {
                    set((state) => ({ isState,userId,isGuest,joinType,nickName,userMaxToken,userRetryLimitSec }));
                    if ( isState ) {
                        Cookies.setCookie('LoginUser',JSON.stringify({isState,userId,isGuest,joinType,nickName,userMaxToken,userRetryLimitSec}));
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