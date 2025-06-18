import { api, ApiResponse } from '@/services/api';

import functions from "@/utils/functions";

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
        console.log("apidata removeChatHistory",session_id)
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
        console.log("apidata updateChatHistoryTitle",session_id,title)
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

export function getChatMessage(session_id: string, msg: string): any {
    try{
        console.log("apidata updateChatHistoryTitle",session_id,msg)
        const res:any =  api.post(`/chat/${session_id}`,{question : msg})
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