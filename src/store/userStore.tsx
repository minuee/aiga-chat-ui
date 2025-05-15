import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'
import * as Cookies from '@/utils/cookies';
interface UserData {
    isState : boolean;
    userId: string;
    isGuest:boolean;
    joinType:string;
    nickName : string
    setUserState: (
        isState : boolean,
        userId: string,
        isGuest:boolean,
        joinType : string,
        nickName : string
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
                setUserState: (isState,userId,isGuest,joinType,nickName) => {
                    set((state) => ({ isState,userId,isGuest,joinType,nickName }));
                    if ( isState ) {
                        Cookies.setCookie('LoginUser',JSON.stringify({isState,userId,isGuest,joinType,nickName}));
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