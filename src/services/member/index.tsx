import { api, ApiResponse } from '@/services/api';
import * as mCookie from "@/utils/cookies";
import functions from "@/utils/functions";
import axios, { AxiosResponse } from 'axios';

interface MemberAuthProps {
    joinType: string;
}

export function getAuthOrigin(props: MemberAuthProps): any {
    
    try{
        console.log("getAuth",props.joinType)
        const res:any =  api.get(`/auth/${props.joinType}`,{
            withCredentials : true
        })
        .then((response) => {
            console.log("response",response.data.url)
            return response.data.url;
        }).catch((error) => {
            console.log("eeeee",error)
            return null;
        });
        return res;
    }catch(error){
        console.log("eeeee 22222",error)
        return null;   
    }
}

export const getAuth = async (props: MemberAuthProps) => {
    try {
        console.log("getAuth",props.joinType)
        const response = await api.get(`/auth/${props.joinType}`);
        console.log("🔗 카카오 로그인 URL:", response.data.url);
        const kakaoAuthUrl = response.data.url;
        // 브라우저를 해당 URL로 이동시킴
        window.location.href = kakaoAuthUrl;
    } catch (error) {
        console.error('카카오 로그인 실패:', error);
    }
}

export const handleKakaoLogin = async (props: MemberAuthProps) => {
    console.log("handleKakaoLogin",props.joinType)
    const response = await axios.get('/auth/kakao', {
        withCredentials: false,
        maxRedirects: 0, // 리디렉션 따라가지 않음
        validateStatus: (status) => status >= 200 && status < 400, // 3xx 응답도 성공으로 간주
    });
    console.log('Location: 1', response.headers);
    const locationHeader = response.headers['location'];
    console.log('Location: 2', locationHeader);
};


export const handleKakaoLogin3 = async (props: MemberAuthProps) => {
    console.log("handleKakaoLogin",props.joinType)
    try {
       
        // 백엔드로부터 카카오 인증 URL을 받음
        const response = await axios.get('/auth/kakao', {
            withCredentials: true,
        });
        // Location 헤더 추출
        const locationHeader = response.headers['location'];

        console.log('Location:', locationHeader);
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