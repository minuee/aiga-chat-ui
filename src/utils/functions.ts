import _ from 'lodash';

const EMAIL_FORMAT =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,}$/i;
const PASSWORD_RULE2 = /^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{8,16}$/i;
const PASSWORD_RULE  = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!.@#$%^&?*])[a-zA-Z0-9!.@#$%^?&*]{8,16}$/;
const MOBILE_FORMAT = /^01([0|1|6|7|8|9]+)-?([0-9]{3,4})-?([0-9]{4})$/i;
const TO_FIXED_POS = 3;

const functions = {
  isEmpty(str:any){
    return str === null || str === undefined || str === '' || (typeof str === 'object' && Array.isArray(str) === false && Object.keys(str).length === 0);
  },

  urlBase64ToUint8Array(base64String: any): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  getKSTUnixTimestamp() {
    // 현재 UTC 시간
    const now = new Date();
  
    // KST는 UTC보다 9시간 빠르므로 9시간을 더해줌 (9 * 60 * 60 * 1000 ms)
    const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  
    // Unix timestamp (초 단위로 변환)
    const unixTimestamp = Math.floor(kstTime.getTime() / 1000);
  
    return unixTimestamp;
  },

  makeLinkify(text: string): string {
    const urlRegex = /(https?:\/\/[^\s\\)]+)/g;

    return text.replace(urlRegex, (url) => {
      const safeUrl = url.replace(/([^:]\/)\/+/g, '$1'); // 중복 슬래시 정리
      console.log("safeUrl",url)
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:blue">링크</a>`;
    });
  },

  cleanEscapedCharacters(text: string): string {
    return text
      .replaceAll(/\\"/g, '')   // \" → "
      .replaceAll(/\\'/g, "")   // \' → '
      .replace(/\\\\\"/g, '"')  // \\\" → "
      .replace(/\\\"/g, '"')    // \" → "
      .replaceAll(/\\\\/g, '\\') // \\ → \
      .replaceAll(/\\n/g, '\n'); // \n → 실제 줄바꿈 (optional)
  },

  getDistance(lat1:any, lon1:any, lat2:any, lon2:any) {
    if ([lat1, lon1, lat2, lon2].some(coord => typeof coord !== 'number' || isNaN(coord))) {
      return Infinity; // 거리 비교에서 항상 뒤로 밀리게
    }
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km 단위 거리 반환
  },


  formatAvailabilityMessage(timestampMs: number, retryLimitSec : number): string {
    try{
      const now = new Date();
      const baseTime = isNaN(timestampMs) || timestampMs <= 0 ? now.getTime() : timestampMs;

      const target = new Date(baseTime + retryLimitSec * 1000);
      // 날짜 비교용 (연/월/일만 비교)
      const isSameDay = now.toDateString() === target.toDateString();
    
      const hours = target.getHours();
      const minutes = target.getMinutes().toString().padStart(2, '0');
    
      const timeText = `${hours}시 ${minutes}분`;
    
      if (isSameDay) {
        return `오늘 ${timeText}`;
      }
    
      // 내일인지 확인
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
    
      const isTomorrow = target.toDateString() === tomorrow.toDateString();
    
      if (isTomorrow) {
        return `내일 ${timeText}`;
      }
    
      // 그 외 날짜
      const month = target.getMonth() + 1;
      const date = target.getDate();
      return `${month}월 ${date}일 ${timeText}`;
    }catch(e:any) {
      return `잠시뒤에`;
    }
  },
  

  parseMaybeJson(str:any) {
    try {
      const parsed = JSON.parse(str);
      // 객체 또는 배열만 통과
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    } catch (_) {}
  
    // JSON이 아니면 그냥 원본 리턴
    return str;
  },

  stripHtmlTags(str:any) {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>/g, '');
  },
  //날짜->문자

  dateToDate(val:any) {
    const happyNewYear = new Date(val);
    const year = happyNewYear.getFullYear();
    const month = happyNewYear.getMonth() + 1;
    const date = happyNewYear.getDate();

    const result = `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`
    return result;
  } ,
  dateToDateTime(val:Date) {
    const happyNewYear = new Date(val);
    const year = happyNewYear.getFullYear();
    const month = happyNewYear.getMonth() + 1;
    const date = happyNewYear.getDate();
    const hours = happyNewYear.getHours();
    const minutes = happyNewYear.getMinutes();
    const seconds = happyNewYear.getSeconds();

    const result = `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date} ${hours}:${minutes}:${seconds}`
    return result;
  } ,
  getDayArray(startDbTime:number, endDbTime:number) {
    if (startDbTime > endDbTime) return []
    const startDay = new Date(startDbTime * 1000)
    const endDay = new Date(endDbTime * 1000)
    endDay.setHours(23, 59, 59, 999)
    const dates = []
    for (let idx = 0; startDay.valueOf() + idx <= endDay.valueOf(); idx += 86400000) {
      let newData = new Date(startDay.valueOf() + idx);
      let year = newData.getFullYear();
      let month = newData.getMonth() + 1;
      let date = newData.getDate();
      let result = `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;

      dates.push(result)
    }
    return dates;
  },
  dateToDateMMDD(val:Date) {
    const happyNewYear = new Date(val);
    const year = happyNewYear.getFullYear();
    const month = happyNewYear.getMonth() + 1;
    const date = happyNewYear.getDate();

    const result = `${month >= 10 ? month : '0' + month}월 ${date >= 10 ? date : '0' + date}일`
    return result;
  } ,

  numberWithCommas(x:any) {
    if (x === undefined || x === null || x === "" || _.isNaN(x)) return x;
    let parts = x.toString().replace(/,/g, "").split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  },
  removeCommas(x:any) {
    if (x === undefined || x === null || x === "" || _.isNaN(x)) return x;
    return String(x).replace(/,/g, "");
  },
  parseFloatWtihCommas(x:any) {
    if (x === undefined || x === null || x === "" || _.isNaN(x)) return 0;
    return parseFloat(String(x).replace(/,/g, ""));
  },
  getCeil(x:any, pos = 0) {
    if (x === undefined || x === null || x === "" || _.isNaN(x)) return 0;
    return Math.ceil(parseFloat(x) * Math.pow(10, pos)) / Math.pow(10, pos);
  },
  getFloor(x:any, pos = 0) {
    if (x === undefined || x === null || x === "" || _.isNaN(x)) return 0;
    return Math.floor(parseFloat(x) * Math.pow(10, pos)) / Math.pow(10, pos);
  },
  getRounds(x:any, pos = 0) {
    if (x === undefined || x === null || x === "" || _.isNaN(x)) return 0;
    return Math.round(parseFloat(x) * Math.pow(10, pos)) / Math.pow(10, pos);
  },
  getRoundsFixed(x:any) {
    if (x === undefined || x === null || x === "" || _.isNaN(x)) return 0;
    return (
      Math.round(parseFloat(x) * Math.pow(10, TO_FIXED_POS)) /
      Math.pow(10, TO_FIXED_POS)
    );
  },
  getFloorFixed(x:any) {
    if (x === undefined || x === null || x === "" || _.isNaN(x)) return 0;
    return (
      Math.floor(parseFloat(x) * Math.pow(10, TO_FIXED_POS)) /
      Math.pow(10, TO_FIXED_POS)
    );
  },
  computePlusFixed(x:any, y:any) {
    if (
      x === undefined ||
      x === null ||
      x === "" ||
      _.isNaN(x) ||
      y === undefined ||
      y === null ||
      y === "" ||
      _.isNaN(y)
    )
      return 0;
    return (
      (Math.floor(parseFloat(x) * Math.pow(10, TO_FIXED_POS)) +
        Math.floor(parseFloat(y) * Math.pow(10, TO_FIXED_POS))) /
      Math.pow(10, TO_FIXED_POS)
    );
  },
  computeMinusFixed(x:any, y:any) {
    if (
      x === undefined ||
      x === null ||
      x === "" ||
      _.isNaN(x) ||
      y === undefined ||
      y === null ||
      y === "" ||
      _.isNaN(y)
    )
      return 0;
    return (
      (Math.floor(parseFloat(x) * Math.pow(10, TO_FIXED_POS)) -
        Math.floor(parseFloat(y) * Math.pow(10, TO_FIXED_POS))) /
      Math.pow(10, TO_FIXED_POS)
    );
  },
  getRandomNumber(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  getRandomString(length:number) {
    return Math.random().toString(36).substr(2, length);
  },
  serialFormat(val:any) {
    return val.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
  },
  floatFormat(val:any) {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    return num.toFixed(1);
  },
  passwordFormat(val:any) {
    return val.toString().replace(/./g, "*");
  },
  moneyFilter(val:any, bCoin:any) {
    if (val === undefined || val === null || val === "" || _.isNaN(val))
      return "0";
    val = String(val);
    // 코인일 경우(소숫점 세자리까지만 입력 가능)
    if (bCoin) {
      // 시작값이 소수점이라면 맨앞에 0 추가
      if (val.indexOf(".") === 0) {
        val = "0" + val;
      }
      const pattern = /^[1-9]{1}[0-9]*$/g;
      if (!pattern.test(val)) {
        val = String(val).replace(/[^0-9.]/g, "");
      }
      // 시작값이 연속된 0이라면 한개만 유지하고 나머지 제거
      if (/^[0][0]/.test(val)) {
        val = String(val).substr(1, val.length);
      }
      // 소수일 때
      if (val.indexOf(".") > 0) {
        const dotNum = val.indexOf(".");
        val = val.replace(/[^0-9]/g, "");
        val = val.split("");
        val.splice(dotNum, 0, ".");
        val = val.join("");
      } else {
        // 정수일 때 0으로 시작한다면 0 제거 (값 0은 제외)
        if (/^[0]+/.test(val) && val.length != 1) {
          val = val.replace(/^[0]+/, "");
        }
      }
      // 소숫점 세자리까지만 나오게 처리
      if (val.indexOf(".") > 0 && val.length - val.indexOf(".") > 4) {
        val = val.substring(0, val.indexOf(".") + 4);
      }
    } else {
      // 캐쉬일 경우(양의 정수만 입력 가능)
      const pattern = /^[1-9]{1}[0-9]*$/g;
      if (!pattern.test(val)) {
        val = String(val).replace(/[^0-9]/g, "");
      }
      // 정수일 때 0으로 시작한다면 0 제거 (값 0은 제외)
      if (/^[0]+/.test(val) && val.length != 1) {
        val = val.replace(/^[0]+/, "");
      }
    }
    return val;
  },
  numberFilter(val:any, bZeroLength:any) {
    if (val === undefined || val === null || val === "" || _.isNaN(val)) {
      return bZeroLength ? "" : "0";
    }
    val = String(val);
    const pattern = /^[1-9]{1}[0-9]*$/g;
    if (!pattern.test(val)) {
      val = String(val).replace(/[^0-9]/g, "");
    }
    return val;
  },
  phoneFilter(val:any) {
    if (val === undefined || val === null) {
      return "";
    }
    val = String(val);
    const pattern = /^[0-9-]$/g;
    if (!pattern.test(val)) {
      val = String(val)
        .replace(/(-)+/g, "-")
        .replace(/[^0-9-]/g, "");
    }
    return val;
  },
  englishNameFilter(val:any) {
    if (val === undefined || val === null || val === "") return val;
    val = String(val);
    const pattern = /^[A-Za-z ]*$/g;
    if (!pattern.test(val)) {
      val = String(val).replace(/[^A-Za-z ]/g, "");
    }
    if (/[ ]{2,}/.test(val)) {
      val = val.replace(/[ ]{2,}/, " ");
    }
    return val;
  },
  emailIdCut(val:any) {
    val = val.split("@");
    return val[0];
  },
  dateFormat(val:any, format:string = "") {
    let ddd:any = val;
    if (String(val).indexOf("-") >= 0) {
      ddd = ddd.replace(/-/gi, "/");
    }
    let date = new Date(ddd);

    let years = date.getFullYear();
    let Month:any = date.getMonth() + 1;
    if (Month < 10) {
      Month = "0" + Month;
    }
    let days:any = date.getDate();
    if (days < 10) {
      days = "0" + days;
    }
    let hour:any = date.getHours();
    if (hour < 10) {
      hour = "0" + hour;
    }
    let min:any = date.getMinutes();
    if (min < 10) {
      min = "0" + min;
    }
    if (format === undefined) {
      return years + "-" + Month + "-" + days;
    } else {
      return years + "-" + Month + "-" + days + " " + hour + ":" + min;
    }
  },
  moneyFormat(val:any) {
    if (
      val === undefined ||
      val === null ||
      val === "" ||
      _.isNaN(val) ||
      val == 0
    )
      return "";
    // 캐쉬일 경우(양의 정수만 입력 가능)
    const pattern = /^[1-9]{1}[0-9]*$/g;
    if (!pattern.test(val)) {
      val = String(val).replace(/[^0-9]/g, "");
    }
    // 정수일 때 0으로 시작한다면 0 제거 (값 0은 제외)
    if (/^[0]+/.test(val) && val.length != 1) {
      val = val.replace(/^[0]+/, "");
    }
    let parts = val.toString().replace(/,/g, "").split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  },
  phoneFormat(val:any) {
    if (val === undefined || val === null || val === "") return val;
    val = String(val).replace(/-/g, "");
    if (val.length <= 7) {
      return val.replace(/([0-9]{3})([0-9]{1})/, "$1-$2");
    } else {
      return val.replace(/([0-9]{3})([0-9]{4})([0-9]{1})/, "$1-$2-$3");
    }
  },
  cardNumFormat(val:any) {
    if (val === undefined || val === null || val === "") return val;
    val = String(val).replace(/-/g, "");
    if (val.length <= 7) {
      return val.replace(/([0-9]{4})([0-9]{1})/, "$1-$2");
    } else if (val.length <= 11) {
      return val.replace(/([0-9]{4})([0-9]{4})([0-9]{1})/, "$1-$2-$3");
    } else {
      return val.replace(
        /([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{1})/,
        "$1-$2-$3-$4"
      );
    }
  },
  expDateFormat(val:any) {
    if (val === undefined || val === null || val === "") return val;
    val = String(val).replace(/-/g, "");
    if (val.length <= 2) {
      return val;
    } else {
      return val.replace(/([0-9]{2})([0-9]{2})/, "$1/$2");
    }
  },
  koreaDateFormat(val:any, format:any) {
    let ddd = val;
    if (String(val).indexOf("-") >= 0) {
      ddd = ddd.replace(/-/gi, "/");
    }
    let date = new Date(ddd);

    date.setHours(date.getHours() + 9);
    let years = date.getFullYear();
    let Month:any = date.getMonth() + 1;
    if (Month < 10) {
      Month = "0" + Month;
    }
    let days:any = date.getDate();
    if (days < 10) {
      days = "0" + days;
    }
    let hour:any = date.getHours();
    if (hour < 10) {
      hour = "0" + hour;
    }
    let min:any = date.getMinutes();
    if (min < 10) {
      min = "0" + min;
    }
    if (format === undefined) {
      return years + "-" + Month + "-" + days;
    } else {
      return years + "-" + Month + "-" + days + " " + hour + ":" + min;
    }
  },
  floorText(val:any) {
    let text = "";
    if (val === "A") {
      text = "전층";
    } else if (val === "W") {
      text = "여성복";
    } else if (val === "M") {
      text = "남성복";
    } else if (val === "AC") {
      text = "악세사리";
    }
    return text;
  },
  isEmail(email:any) {
    if (!_.isString(email)) {
      return false;
    }
    return !!email.match(EMAIL_FORMAT);
  },
  isPassword(password:any) {
    if (!_.isString(password)) {
      return false;
    }
    if(!PASSWORD_RULE.test(password)){
      //작동시킬 로직
      return false;
    }else{
      return true;
    }
    //return !!password.match(PASSWORD_RULE);
  },
  isMobilePhone(mobile:any) {
    if (!_.isString(mobile)) {
      return false;
    }
    return !!mobile.match(MOBILE_FORMAT);
  },

  isMobile (userAgent: string): boolean  {
    return /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
  },

  getEmailId(email:any) {
    if (email != null && email && email.indexOf("@") >= 0) {
      return email.substring(0, email.indexOf("@"));
    }
    return email;
  },

  isSocialEmail(email:any) {
    if (
      (email && email.endsWith("@facebook.com")) ||
      email.endsWith("@naver.com") ||
      email.endsWith("@apple.com") ||
      email.endsWith("@kakao.com")
    ) {
      return true;
    }
    return false;
  },
  timeCount(second:any) {
    const strTimeLeft = `${Math.floor(second / 60).toString()}:${
      second % 60 < 10 ? "0" : ""
    }${second % 60}`;
    return strTimeLeft;
  },
  timeFormat(time:any) {
    let hour = time > 12 ? time % 12 : time;
    let ampm = time > 12 ? "PM" : "AM";

    return hour + ":00 " + ampm;
  },
  expireDday(data:any) {
    const now = new Date();
    const then = new Date(data); // 크리스마스
    let gap = then.getTime() - now.getTime();
    gap = Math.floor(gap / (24 * 60 * 60 * 1000)) + 1;
    let result = gap <= 0 ? "D-Day" : "D-" + gap;
    return result;
  },
  isValidDate(year:any, month:any, day:any) {
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12) {
      return false;
    }
    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
      monthLength[1] = 29;
    }
    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  },
  FalsyValueCheck(obj:any, exceptionKeys:any = []) {
    let result = true;
    Object.keys(obj).forEach((key) => {
      if (!exceptionKeys.includes(key)) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
          result = false;
          return;
        }
      }
    });
    return result;
  },
  downloadURI(uri:string, media_type = "", name = "") {
    var link = document.createElement("a");
    link.setAttribute("download", name);
    link.setAttribute("media_type", media_type);
    link.setAttribute('target','_blank');
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  changeHour(ampm:any, hour:any) {
    var ap = ampm;
    var h = parseInt(hour);
    if (ap === "PM") {
      h = h + 12;
    }
    if (h === 24) {
      h = 0;
    }

    return h;
  },
  getUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 3) | 8;
        return v.toString(16);
      }
    );
  },
  filterFirstCode(code:any , arr:any, selfArray:any) {
    let ret = _.filter(arr,function(p) {
      return p.h_code == code;
    })

    if ( ret.length == 0) {
      let ret2 = _.filter(selfArray,function(p) {
        return p.code == code;
      })
      return ['local',ret2[0].data];
    }else{
      return ['api',ret];
    }

  },


  // 용지외에는 사용불가
  getPaperNextArray(depth : number = 2, reArray : any, commonCodeinfo : any, parentFilters : any = []){
    let newOption:any = [];

    const parentCode = reArray.filter((element:any) => element.selected)
    if ( depth == 2 && parentCode[0]?.code != 'all' ) {

      const arr  = commonCodeinfo[parentCode[0]?.code];
      arr?.paper_kind.forEach((item:any) => {
        newOption.push({
          name: item.paper_type_name,
          code: item.paper_type_code,
          h_code : 'PKD2',
          ref_key : null,
          type: 'code',
          selected : false
        })
      });
    }else if ( depth == 3 && parentCode[0]?.code != 'all' ) {


      const grandParentCode = parentFilters[0].data.filter((element:any) => element.selected)
      if ( grandParentCode.length > 0 ) {
        const arr  = commonCodeinfo[grandParentCode[0].code].paper_type_code[parentCode[0]?.code];
        newOption = [
          {
            name: '전체',
            code: 'all',
            h_code : 'PKD3',
            ref_key : null,
            type: 'code',
            selected : false
          }
        ]
        arr?.forEach((item:any) => {
          newOption.push({
            name: item.paper_name,
            code: item.paper_code,
            h_code : 'PKD3',
            ref_key : null,
            type: 'code',
            selected : false
          })
        });
      }
    }


    return newOption;
  },

  filterCode(h_code:any , arr:any) {
    const ret = _.filter(arr,function(p) {
      return p.code == h_code;
    })
    return ret[0]?.data;
  },

  filterSelectCode(sItem:any, arr:any) {
    let newOption:any = [];
    try {
      const gcode = this.filterCode(sItem.h_code,arr);

      if ( gcode.length > 0 ) {
        gcode.forEach((item:any) => {
          newOption.push({
            ...item,
            selected : item.code == sItem.code ? true : false
          })
        });
      }
      return newOption
    }catch(e){
      return newOption
    }
  },

  filterSelected ( arr:any ) {
    let returnItem  = arr[0];
    if ( arr.length > 0 ) {
      arr.forEach((item:any) => {
        if ( item?.selected ) {
          returnItem = item;
        }
      });
    }
    return returnItem;
  },
  getImageSize(act:any, src:any) {
    var img = new Image();
    var _width, _height;

    img.src = src;
    _width = img.width;
    _height = img.height;
    if (act === "w") {
      return _width;
    } else if (act === "h") {
      return _height;
    }
  },
  checkValueNull(str:any) {
    if (typeof str == "undefined" || str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },

  copyStyles(sourceDoc:any, targetDoc:any) {
    Array.from(sourceDoc.styleSheets).forEach((styleSheet:any) => {
      if (styleSheet.cssRules) {
        // true for inline styles
        const newStyleEl = sourceDoc.createElement("style");

        Array.from(styleSheet.cssRules).forEach((cssRule:any) => {
          newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
        });

        targetDoc.head.appendChild(newStyleEl);
      } else if (styleSheet.href) {
        // true for stylesheets loaded from a URL
        const newLinkEl = sourceDoc.createElement("link");

        newLinkEl.rel = "stylesheet";
        newLinkEl.href = styleSheet.href;
        targetDoc.head.appendChild(newLinkEl);
      }
    });
  },

  getStringBytes(tmpstr:string){
    let character;
    let charBytes = 0;
    let str = new String(tmpstr);
    if ( str == "" ) {
      return 0;
    }
    for (let i = 0; i < str.length; i += 1) {
      character = str.charAt(i);

      if (escape(character).length > 4) charBytes += 2;
      else charBytes += 1;
    }
    return charBytes;
  },

};

export default functions;
