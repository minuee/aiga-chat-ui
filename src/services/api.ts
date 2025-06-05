import axios, { AxiosResponse } from 'axios';
import * as mCookie from "@/utils/cookies";

export type ApiResponse<T> = Promise<AxiosResponse<T>>;
type State = 'true' | 'false';
export type ServiceResponse<T> = {
  state: State;
} & T;

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:9999';
axios.defaults.withCredentials = false;

axios.interceptors.request.use(
  function (config) {
    config.baseURL = baseURL;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axios.interceptors.request.use((config) => {
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidWlkX2ViZjE4YzE5LWE1N2UtNDlhMC1hY2JkLTMwZGQ2MzU4NDRhNSIsInNuc190eXBlIjoia2FrYW8iLCJzbnNfaWQiOiI0MjkxODg1MjIzIiwiaWF0IjoxNzQ5MTA5NjEyLCJleHAiOjE3NDkxOTYwMTJ9.p7hlsd2YRcJdNu6OJrIoDhEydUiDEeEtBXTz9YMBEsY';//mCookie.getCookie('accessToken');
  console.log("accessToken axios",accessToken)
  config.headers['Authorization'] = `Bearer ${accessToken}` 
  return config
})

axios.interceptors.response.use(
  res => {
    if (res.status === 200) {
      if (res.data.state === 'false') {
      }
    }else{
      // Toast(res?.data?.message? res.data.message : '오류가 발생하였습니다.')
      console.log("error of error ")
    }
    return res;
  },
  err => {
    const response = err.response;
    if (response) {
      let message = response.data ? response.data.message : response.message;
    } else {
      console.log('response err : ', { err });
    }
    return Promise.reject(err);
  },
);

export const bearer = (authToken: string) => `Bearer ${authToken}`;

export const multipart = { 'Content-Type': 'multipart/form-data' };

export const api = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};
