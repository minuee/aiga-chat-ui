import React from "react";

type PopWindowProps = {
  children: React.ReactElement;
  window_width?: number;
  window_height?: number;
  url: string;
};

const PopWindowScreen: React.FC<PopWindowProps> = ({
    children,
    window_width = 450,
    window_height = 900,
    url,
  }) => {
    const handleClick = () => {
      const dualScreenLeft = window.screenLeft ?? window.screenX;
      const dualScreenTop = window.screenTop ?? window.screenY;
      const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
      const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;
      const left = width / 2 - window_width / 2 + dualScreenLeft;
      const top = height / 2 - window_height / 2 + dualScreenTop;
  
      const features = `
        width=${window_width},
        height=${window_height},
        top=${top},
        left=${left},
        resizable=false,
        scrollbars=yes
      `.replace(/\s/g, ""); // 공백 제거 (일부 브라우저는 공백 싫어함)
  
      const popup = window.open("about:blank", "_blank", features);
  
      if (popup) {
        popup.document.write("로딩 중...");
        popup.location.href = `${window.location.origin}${url}`;
        popup.focus();
      } else {
        alert("팝업 차단이 되어 있습니다. 브라우저 설정을 확인해주세요.");
      }
    };
  
    const clonedElement = React.cloneElement(children, {
      onClick: handleClick,
    });
  
    return clonedElement;
  };
  

export default PopWindowScreen;
