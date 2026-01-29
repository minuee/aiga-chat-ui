import { api, ApiResponse } from '@/services/api';
import * as mCookie from "@/utils/cookies";
import functions from "@/utils/functions";
import axios, { AxiosResponse } from 'axios';

const logApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL, // 실제 로그 서버 주소로 변경
    timeout: 5000,
});

const rawAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});

import UserStateStore from '@/store/userStore';

interface MemberAuthProps {
    joinType: string;
}

export function getAuthOrigin(props: MemberAuthProps): any {
    
    try{
        const res:any =  api.get(`/auth/${props.joinType}`,{
            withCredentials : true
        })
        .then((response) => {
            return response.data.url;
        }).catch((error) => {
            return null;
        });
        return res;
    }catch(error){
        return null;   
    }
}

export const getAuth = async (props: MemberAuthProps) => {
    try {
        const response = await api.get(`/auth/${props.joinType}`);
        const kakaoAuthUrl = response.data.url;
        // 브라우저를 해당 URL로 이동시킴
        window.location.href = kakaoAuthUrl;
    } catch (error) {
        console.error('카카오 로그인 실패:', error);
    }
}

export const handleKakaoLogin = async (props: MemberAuthProps) => {
    const response = await axios.get('/auth/kakao', {
        withCredentials: false,
        maxRedirects: 0, // 리디렉션 따라가지 않음
        validateStatus: (status) => status >= 200 && status < 400, // 3xx 응답도 성공으로 간주
    });
    const locationHeader = response.headers['location'];

};


export const handleKakaoLogin3 = async (props: MemberAuthProps) => {
    try {
       
        // 백엔드로부터 카카오 인증 URL을 받음
        const response = await axios.get('/auth/kakao', {
            withCredentials: true,
        });
        // Location 헤더 추출
        const locationHeader = response.headers['location'];

        const kakaoAuthUrl = locationHeader;//response.data.url;
        window.location.href = kakaoAuthUrl;
        /* const popup = window.open(
        `${kakaoAuthUrl}`, // Next.js에서 프록시된 백엔드 URL
        'kakaoLogin',
        `width=400,height=600`
        ); */
    } catch (error) {
        console.error('handleKakaoLogin 카카오 로그인 에러:', error);
    }
};

interface SetNickNamerops {
    reqData: any;
}

export function setNickname(reqData: SetNickNamerops): any {
    try{
        const res:any =  api.patch(`/users/nickname`,{nickname : reqData})
        .then((response) => {
             return response?.data;
        }).catch((error) => {
             console.log("eeeee",error)
            return null;
        });
        return res;
    }catch(error){
        console.log("eeeee",error)
        return null;   
    }
 }

export function setSignupAgree(): any {
    try{
        const res:any =  api.get(`/users/agreement`)
        .then((response) => {
             return response?.data;
        }).catch((error) => {
             console.log("eeeee",error)
            return null;
        });
        return res;
    }catch(error){
        console.log("eeeee",error)
        return null;   
    }
 }

 export function setMemberEntire(): any {
    try{
        const res:any =  api.get(`/users/unregister`)
        .then((response) => {
             return response?.data;
        }).catch((error) => {
             console.log("eeeee",error)
            return null;
        });
        return res;
    }catch(error){
        console.log("eeeee",error)
        return null;   
    }
 }

 export async function setMemberLogout(): Promise<any> {
    try{
        const res:any =  await api.get(`/auth/logout`)
        .then((response) => {
             return response?.data;
        }).catch((error) => {
            return {
                error: true,
                status: error?.response?.status || 500,
                message: error?.response?.data || 'Unknown error',
            };
        });
        return res;
    }catch(error){
        console.log("eeeee",error)
        return null;   
    }
 }


 export function regitPWAToken(newSub: any): any {
    try{
        const { email,userId,isGuest} = UserStateStore.getState();
        const userAgent = getClientEnvInfo()
        const payload = {
            user_id : isGuest ? "guest" : userId,
            user_email : isGuest ? "guest" : email,
            user_agent : JSON.stringify(userAgent),
            endpoint: newSub ? newSub?.endpoint : null,
            scribe_key: newSub ? JSON.stringify(newSub) : null,
        };

        logApi.post('/subscribe', payload).catch(() => {});
   }catch(error){
        console.log("eeeee",error)
        return null;   
   }
}

export function removePWAToken(newSub: any): any {
    try{
        if ( newSub?.endpoint ) {
            const endpoint = newSub ? newSub?.endpoint : null

            logApi.delete(`/subscribe?key=${endpoint}`).catch(() => {});
        }else {
            return true;
        }
   }catch(error){
        console.log("eeeee",error)
        return null;   
   }
}

function getClientEnvInfo() {
    if (typeof window === 'undefined') return {};

    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
        screen: {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
        }
    };
}