import { api, ApiResponse } from '@/services/api';
import axios from 'axios';
import UserStateStore from '@/store/userStore';


const logApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL, // 실제 로그 서버 주소로 변경
    timeout: 5000,
});

export function getChatNewSession(): any {
    try{
        const res:any =  api.post(`/new_session`)
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


export function setRequestStop(session_id: string): any {
    try{
        const res:any =  api.delete(`/chat/${session_id}`)
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


export function getChatHistoryList(): any {
    try{
        const res:any =  api.get(`/history`)
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


interface RemoveHistoryProps {
    session_id: any;
}

export function removeChatHistory(session_id: RemoveHistoryProps): any {
    try{
        const res:any =  api.delete(`/history/${session_id}`)
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


export function updateChatHistoryTitle(session_id: string, title: string): any {
    try{
        const res:any =  api.patch(`/history/${session_id}`,{title})
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

export function getChatMessage(session_id: string, msg: string): any {
    try{
        const res:any =  api.post(`/chat/${session_id}`,{question : msg},{ timeout : 20000})
            .then((response) => {
                if ( process.env.NODE_ENV == 'development') {
                    const { email,userId,isGuest} = UserStateStore.getState();
                    const userAgent = getClientEnvInfo()
                    const errorPayload = {
                        session_id,
                        user_id : isGuest ? "guest" : userId,
                        user_email : isGuest ? "guest" : email,
                        user_agent : JSON.stringify(userAgent),
                        user_message: msg,
                        error_message: JSON.stringify(response),
                        error_code: response?.status || 500,
                    };

                    logApi.post('/log', errorPayload).catch(() => {});
                }
                return response?.data;
            }).catch((error) => {
                const { email,userId,isGuest} = UserStateStore.getState();
                const userAgent = getClientEnvInfo()
                const errorPayload = {
                    session_id,
                    user_id : isGuest ? "guest" : userId,
                    user_email : isGuest ? "guest" : email,
                    user_agent : JSON.stringify(userAgent),
                    user_message: msg,
                    error_message: JSON.stringify(error),
                    error_code: error?.response?.status || 500,
                };

                logApi.post('/log', errorPayload).catch(() => {});
                // 상황에 따라 에러를 더 명확하게 넘겨줄 수도 있어요
                if ( error.code == 'ECONNABORTED'){
                    // 타임아웃 에러 처리
                    return {
                        error: true,
                        status: 408,
                        statusCode : 408,
                        message: '요청 시간이 초과되었습니다. (20초 제한)',
                    };
                }else{
                    return {
                        error: true,
                        status: error?.response?.status || 500,
                        message: error?.response?.data || 'Unknown error',
                    };
                }
            });
            return res; 
   }catch(error){
        console.log("eeeee",error)
        return null;   
   }
}

export function saveErrorLog(session_id: string, msg: string,fromMessage:string): any {
    try{
        const { email,userId,isGuest} = UserStateStore.getState();
        const userAgent = getClientEnvInfo()
        const errorPayload = {
            session_id,
            user_id : isGuest ? "guest" : userId,
            user_email : isGuest ? "guest" : email,
            user_agent : JSON.stringify(userAgent),
            user_message: msg,
            error_message: fromMessage,
            error_code: 500,
        };

        logApi.post('/log', errorPayload).catch(() => {});
   }catch(error){
        console.log("eeeee",error)
        return null;   
   }
}