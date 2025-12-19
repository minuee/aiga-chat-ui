import { api, ApiResponse } from '@/services/api';
import axios from 'axios';
import { UserBasicInfoStore } from '@/store/userStore';
import { decryptToken } from "@/utils/secureToken";
import { defaultUserInfo } from "@/types/userData"

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


interface sessionHistoryProps {
    session_id: any;
}

export function removeChatHistory(session_id: sessionHistoryProps): any {
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


export function getChatHistory(session_id: sessionHistoryProps): any {
    try{
        const res:any =  api.get(`/history/${session_id}`)
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
        const res:any =  api.post(`/chat/${session_id}`,{question : msg},{ timeout : 60000})
            .then((response) => {
                if ( process.env.NODE_ENV == 'development') {
                    const { userStoreInfo } = UserBasicInfoStore.getState();
                    const deCryptInfo = decryptToken(userStoreInfo)
                    const decryptedUser = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
                    const { email,userId,isGuest } = decryptedUser || {};
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

                    api.post('/log', errorPayload).catch(() => {});
                }
                return response?.data;
            }).catch((error) => {
                const { userStoreInfo } = UserBasicInfoStore.getState();
                const deCryptInfo = decryptToken(userStoreInfo)
                const decryptedUser = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
                const { email,userId,isGuest } = decryptedUser || {};
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

                api.post('/log', errorPayload).catch(() => {});
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
        const { userStoreInfo } = UserBasicInfoStore.getState();
        const deCryptInfo = decryptToken(userStoreInfo)
        const decryptedUser = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
        const { email,userId,isGuest } = decryptedUser || {};
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

        api.post('/log', errorPayload).catch(() => {});
   }catch(error){
        console.log("eeeee",error)
        return null;   
   }
}