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
        const res:any =  api.get(`/auth/${props.joinType}`)
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
    try {
        // 백엔드로부터 카카오 인증 URL을 받음
        const response = await axios.get('/auth/kakao', {
            withCredentials: false,
        });
        const kakaoAuthUrl = response.data.url;
  
        // axios가 아닌 브라우저 이동
        window.location.href = kakaoAuthUrl;
    } catch (error) {
        console.error('카카오 로그인 에러:', error);
    }
};