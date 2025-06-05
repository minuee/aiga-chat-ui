import { api, ApiResponse } from '@/services/api';

import functions from "@/utils/functions";


interface MemberAuthProps {
    joinType: string;
}

export function getAuth(props: MemberAuthProps): any {
   try{
    console.log("getAuth",props.joinType)
    const res:any =  api.get(`/auth/${props.joinType}`)
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