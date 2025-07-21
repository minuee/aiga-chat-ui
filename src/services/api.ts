import axios, { AxiosResponse,AxiosRequestConfig } from 'axios';
import * as mCookie from "@/utils/cookies";
import mConstants from '@/utils/constants';
import { decryptToken } from "@/utils/secureToken";
import functions from '@/utils/functions';
import { UserBasicInfoStore } from '@/store/userStore';
import { defaultUserInfo } from "@/types/userData"

export type ApiResponse<T> = Promise<AxiosResponse<T>>;
type State = 'true' | 'false';
export type ServiceResponse<T> = {
  state: State;
} & T;


const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:9999';
axios.defaults.withCredentials = true;

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

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
  try{
    const { userStoreInfo } = UserBasicInfoStore.getState();
    const deCryptInfo = decryptToken(userStoreInfo)
    const decryptedUser = userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ?  JSON.parse(deCryptInfo) : userStoreInfo;
    const { email  } = decryptedUser;

    const accessTmpToken =  mCookie.getCookie(mConstants.apiTokenName);
    console.log("accessTmpToken",email,accessTmpToken)
    if ( !functions.isEmpty(accessTmpToken) && !functions.isEmpty(email)) { 
      const accessToken =  decryptToken(accessTmpToken)
      config.headers['Authorization'] = functions.isEmpty(accessToken) ? null : `Bearer ${accessToken}` 
    }
    return config
  }catch(e:any){
    console.log("accessTmpTokeneee",e)
    return config
  }
})

// 기존 요청을 다시 실행하기 위한 함수 등록
function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// ✅ 응답 인터셉터: 401 처리
axios.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config as any;

    // ✅ 로그아웃 요청은 refresh 시도하지 않음
    if (originalRequest?.url?.includes('/auth/logout')) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!functions.isEmpty(refreshToken)) {
          const res = await axios.post('/auth/refresh', { refreshToken });

          const newAccessToken = res.data.accessToken;
          mCookie.setCookie(mConstants.apiTokenName, newAccessToken);
          onRefreshed(newAccessToken);
          isRefreshing = false;

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        mCookie.removeCookie(mConstants.apiTokenName);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/* 
axios.interceptors.response.use(
  res => {
    if (  mConstants.apiSuccessCode.includes(res?.status)) {
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
); */

export const bearer = (authToken: string) => `Bearer ${authToken}`;

export const multipart = { 'Content-Type': 'multipart/form-data' };

export const api = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};
