import { api, ApiResponse } from '@/services/api';

import functions from "@/utils/functions";


interface SetRequestProps {
    reqData: any;
}

export function setRequest(reqData: SetRequestProps): any {
    try{
        console.log("accessToken setRequest",reqData)
        const res:any =  api.post(`/opinion`,reqData)
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
