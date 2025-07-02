// components/TokenGuard.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import * as mCookie from "@/utils/cookies";
import functions from '@/utils/functions';
import { useToast } from '@chakra-ui/react';
import UserStateStore from '@/store/userStore';
import NewChatStateStore from '@/store/newChatStore';
import ConfigInfoStore from '@/store/configStore';
import { DrawerHistoryStore } from '@/store/modalStore';
import mConstants from '@/utils/constants';

export default function TokenGuard() {
    const toast = useToast();
    const router = useRouter();
    const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);
    const setLoginUserInfo = UserStateStore((state) => state.setUserState);
    const [isOpenLogoutModal, setIsOpenLogoutModal] = useState(false);
    const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
    const setOpenHistoryDrawer = DrawerHistoryStore((state) => state.setOpenHistoryDrawer);

    const onHandleLogoutAction = () => {
        toast({
            title: "비정상적인 로그인 상태입니다. 로그아웃되었습니다.",
            position: 'top-right',
            status: 'error',
            containerStyle: {
              color: '#ffffff',
            },
            isClosable: true,
            duration:1500
          });
        /* 여기서 전체 로그아웃을 처리한다 
        1. 세션제거
        2. Global State null 처리
        */
        
        setLoginUserInfo({
        isState : false, //isState
        sns_id: '', //sns_id
        email : '', //email
        profileImage : '', //profileImage
        agreement : false, //agreement
        registDate : '', //registDate
        unregistDate : '',//unregistDate
        updatedDate : '',//updatedDate
        userId :  "Guest",//userId
        isGuest : true, //isGuest
        joinType : '',//joinType
        nickName : '',//nickName
        userMaxToken :guestMaxToken,//userMaxToken
        userRetryLimitSec : guestRetryLimitSec//userRetryLimitSec
        });
        mCookie.removeCookie(mConstants.apiTokenName)
        setIsOpenLogoutModal(false)
        setNewChatOpen(false);
        setTimeout(() => {
            setNewChatOpen(true);
            fn_close_drawer_history();
        }, 60);
    }

    const fn_close_drawer_history = async() => {
        const locale = await mCookie.getCookie('currentLocale') ?  mCookie.getCookie('currentLocale') : 'ko'; 
        setOpenHistoryDrawer(false);
        router.replace(`/${locale}/chat`);
        setTimeout(() => {
          mCookie.setCookie('currentPathname','') ;
        }, 200);
      }

    useEffect(() => {
        const token = mCookie.getCookie('aiga-minuee');
        console.log("token",token);
        if (functions.isEmpty(token)) {
            onHandleLogoutAction();
        }
    }, []);

    return null; // 이 컴포넌트는 감시 역할만
}
