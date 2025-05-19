import { useRef,useEffect } from "react";
import ReactDOM from "react-dom";
import functions from "../../utils/functions";

type DepWindowProps = {
    windowSrc?: string;
    title: string;
    width?: number;
    height?: number;
    children: React.ReactNode;
    closeWindowPortal: (isOpen: boolean) => void;
};

const DepWindow = ({ windowSrc = "",title,width = 600,height = 600,children,closeWindowPortal }: DepWindowProps) => {
  
    const externalWindow = useRef<Window | null>(null);
    const containerEl = useRef(document.createElement("div"));
  
    useEffect(() => {
      // 팝업 창 열기
      externalWindow.current = window.open(
        windowSrc,
        "sw",
        `width=${width},height=${height},left=200,top=100`
      );
  
      if (externalWindow.current) {
        const extDoc = externalWindow.current.document;
  
        extDoc.title = title;
        extDoc.body.appendChild(containerEl.current);
  
        // 스타일 복사
        functions.copyStyles(document, extDoc);
  
        // 팝업 닫힐 때 처리
        externalWindow.current.addEventListener("beforeunload", () => {
          closeWindowPortal(false);
        });
      } else {
        console.warn("팝업 창을 열 수 없습니다. 팝업 차단 기능이 활성화됐을 수 있습니다.");
      }
  
      // cleanup: 컴포넌트 unmount 시 팝업 닫기
      return () => {
        if (externalWindow.current) {
          externalWindow.current.close();
        }
      };
    }, [windowSrc, title, width, height, closeWindowPortal]);
  
    return ReactDOM.createPortal(children, containerEl.current);
  };
  
  export default DepWindow;