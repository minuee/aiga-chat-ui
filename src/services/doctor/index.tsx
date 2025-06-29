import { api, ApiResponse } from '@/services/api';

import functions from "@/utils/functions";



export function setReviewData(reqData: any, isRegist: boolean): any {
    try{
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

export function getDoctorBasicData(did: any): any {
    try{
        const res:any =  api.get(`/doctors/${did}`)
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

export function getReviewListData(did: any): any {
    try{
        const res:any =  api.get(`/reviews?doctor_id=${did}`)
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


interface GetReviewDataProps {
    rid: any;
}

export function getReviewData(rid: GetReviewDataProps): any {
    try{
        const res:any =  api.get(`/reviews/${rid}`)
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

export function removeReviewData(review_id: string): any {
    try{
        const res:any =  api.delete(`/reviews/${review_id}`)
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

export function registModifyDoctorInfo(doctor_id: string, title: string,content : any): any {
    try{
        const res:any =  api.post(`/opinion/doctor/${doctor_id}`,{title,content})
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


