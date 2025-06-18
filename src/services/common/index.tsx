import { api, ApiResponse } from '@/services/api';

import functions from "@/utils/functions";
/* 
interface PaginationProps {
    hospitalId: string;
    page: number;
    take: number;
    order: string;
    orderName: string;
    keyword? : string;
}

export function getDoctorList(props: PaginationProps): ApiResponse<any> {
    if ( !functions.isEmpty(props.page) && !functions.isEmpty(props.take) && !functions.isEmpty(props.order) && !functions.isEmpty(props.orderName) ) {
        return api.get(`/doctors/hid/${props.hospitalId}?orderName=${props.orderName}&order=${props.order}&page=${props.page}&take=${props.take}&keyword=${props.keyword}`);
    }else{
        return Promise.reject(new Error('Invalid props'));
    } 
} */

export function getCommonConfig(): any {
    try{
        const res:any =  api.get(`/config`)
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

export function getNoticeList(): any {
    try{
        const res:any =  api.get(`/notice`)
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
