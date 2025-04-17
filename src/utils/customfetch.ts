
// 하단 how to use 참고
class CustomAPiFetch {

    // '', null, undefinded, 빈객체{} 체크
    isEmpty = (str:string) => {
        return str === null || str === undefined || str === '' || (typeof str === 'object' && Array.isArray(str) === false && Object.keys(str).length === 0);
    };

    // call API with timeout Function, default limit = 30 seconds
    callAPI = async (url:string, options:any = null, FETCH_TIMEOUT:any = 30000, signal:any = null) => {
        const myTimeout = this.isEmpty(FETCH_TIMEOUT) ? 30000 : FETCH_TIMEOUT;
        return this.requestAPI(url, options, myTimeout, signal);
    };

    requestAPI = async (url:string, options:any = null, FETCH_TIMEOUT = 30000, signal = null) => {
        
        try {
          const response = await this.fetchWithTimout(url, options, FETCH_TIMEOUT, signal) as any;
      
          ///const responseJson = await response.json();
      
          return response;
        } catch (error:any) {
            throw new Error(error);
        }
      };

    // fetch with timeout
    fetchWithTimout = async (url:string, options:any = null, FETCH_TIMEOUT:number = 30000, signal:any) => {
        return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), FETCH_TIMEOUT),
        ),
        ]);
    };
}

const CustomFetch = new CustomAPiFetch();
export default CustomFetch;

