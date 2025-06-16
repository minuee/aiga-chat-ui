import { api, ApiResponse } from '@/services/api';

import functions from "@/utils/functions";



export function setReviewData(reqData: any, isRegist: boolean): any {
    try{
        console.log("onHandleRegistReview registReview",isRegist,reqData)
        if ( isRegist ) { //등록
            const res:any =  api.post(`/reviews`,reqData)
            .then((response) => {
                return response?.data;
            }).catch((error) => {
                console.log("eeeee",error)
                return null;
            });
            return res;
        }else{
            const res:any =  api.patch(`/reviews/${reqData?.review_id}`,reqData)
            .then((response) => {
                return response?.data;
            }).catch((error) => {
                console.log("eeeee",error)
                return null;
            });
            return res; 
        }
   }catch(error){
        console.log("eeeee",error)
        return null;   
   }
}


interface GetReviewDataProps {
    did: any;
}

export function getReviewData(did: GetReviewDataProps): any {
    try{
        console.log("onHandleRegistReview getReviewData",did)
        const res:any =  api.get(`/reviews/${did}`)
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
