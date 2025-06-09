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