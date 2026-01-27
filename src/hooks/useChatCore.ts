
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { isMobileOnly } from 'react-device-detect';
import functions from '@/utils/functions';
import * as ChatService from "@/services/chat/index";
import mConstants from '@/utils/constants';
import * as mCookie from "@/utils/cookies";
import { decryptResponse } from '@/utils/crypto';
import { decryptToken } from "@/utils/secureToken";
import { defaultUserInfo } from "@/types/userData"

// Store Imports
import ConfigInfoStore from '@/store/configStore';
import NewChatStateStore, { ChatSesseionIdStore, CurrentDialogStore, CallHistoryDataStore } from '@/store/newChatStore';
import { UserBasicInfoStore } from '@/store/userStore';
import { useLocationStore } from '@/store/locationStore';
import historyStore from '@/store/historyStore';
import {
  DoctorFromListStore,
  ModalDoctorDetailStore,
  ModalDoctorListStore,
  ModalDoctorRequestStore,
  ModalDoctorReviewStore,
  ModalMypageEntireStore,
  ModalMypageMingamStore,
  ModalMypageNoticeDetailStore,
  ModalMypageNoticeStore,
  ModalMypagePolicyStore,
  ModalMypageRequestStore,
  ModalMypageYakwanStore,
  ModalSignupAgreeStoreStore,
  ModalSignupStoreStore,
  ReviewAlertStore,
  ModalMypageStore,
  DrawerHistoryStore
} from '@/store/modalStore';
import debounce from 'lodash/debounce';

interface ChatDisabledState {
  isState: boolean;
  isAlertMsg: boolean;
  reTryTimeStamp: number;
  remainTimeStamp: number;
}

export const useChatCore = () => {
  const toast = useToast();
  const [inputCode, setInputCode] = useState<string>('');
  const [isReceiving, setReceiving] = useState(false);
  const [isThinkingDeeply, setIsThinkingDeeply] = useState<boolean>(false);
  const [hasSent, setHasSent] = useState(false);
  const [realOutputCode, setRealOutputCode] = useState<any[]>([]);
  const [isChatDisabled, setChatDisabled] = useState<ChatDisabledState>({
    isState: true,
    isAlertMsg: false,
    reTryTimeStamp: 0,
    remainTimeStamp: 0
  });
  const [in24UsedToken, setIn24UsedToken] = useState(0);

  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const requestRef = useRef(0);
  const alreadyInitialized = useRef(false);

  useEffect(() => {
    if (!alreadyInitialized.current) {
        const loadData = CurrentDialogStore.getState().messageData;
        if (loadData && loadData.length > 0) {
            setRealOutputCode(loadData);
        }
        alreadyInitialized.current = true;
    }
  }, []);

  // Zustand states
  const userStoreInfo = UserBasicInfoStore(state => state.userStoreInfo);
  const { latitude, longitude } = useLocationStore();
  const { userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec } = ConfigInfoStore(state => state);
  const isNewChat = NewChatStateStore(state => state.isNew);
  const setNewChatOpen = NewChatStateStore((state) => state.setNewChatState);
  const chatSessionId = ChatSesseionIdStore(state => state.chatSessionId);
  const currentHistorySelectDate = ChatSesseionIdStore(state => state.currentHistorySelectDate);
  const setChatSessionId = ChatSesseionIdStore((state) => state.setChatSessionId);
  const setOutputCode = CurrentDialogStore((state) => state.setCurrentMessageData);
  const outputCode = CurrentDialogStore(state => state.messageData);
  const oldHistoryData = CallHistoryDataStore(state => state.historyData);
  const setOldHistoryData = CallHistoryDataStore((state) => state.setOldHistoryData);
  const resetUserBasicInfo = UserBasicInfoStore((state) => state.resetUserBasicInfo);
  const setCurrentPathname = historyStore((state) => state.setCurrentPathname);

  // Modal states
  const setIsOpenReview = ModalDoctorReviewStore((state) => state.setModalState);
  const setOpenHistoryDrawer = DrawerHistoryStore((state) => state.setOpenHistoryDrawer);
  const setIsOpenRequestModal = ModalDoctorRequestStore((state) => state.setModalState);
  const setOpenDoctorListModal = ModalDoctorListStore((state) => state.setOpenDoctorListModal);
  const setIsOpenDoctorDetailModal = ModalDoctorDetailStore((state) => state.setOpenDoctorDetailModal);
  const setIsOpenSetupModal = ModalMypageStore((state) => state.setIsOpenSetupModal);
  const setIsOpenNoticeListModal = ModalMypageNoticeStore((state) => state.setIsOpenNoticeListModal);
  const setIsOpenNoticeDetailModal = ModalMypageNoticeDetailStore((state) => state.setIsOpenNoticeDetailModal);
  const setIsOpenMypageRequestModal = ModalMypageRequestStore((state) => state.setIsOpenMypageRequestModal);
  const setIsOpenEntireModal = ModalMypageEntireStore((state) => state.setIsOpenEntireModal);
  const setIsOpenPolicyModal = ModalMypagePolicyStore((state) => state.setIsOpenPolicyModal);
  const setIsOpenYakwanModal = ModalMypageYakwanStore((state) => state.setIsOpenYakwanModal);
  const setIsOpenMingamModal = ModalMypageMingamStore((state) => state.setIsOpenMingamModal);
  const setIsOpenSignupModal = ModalSignupStoreStore((state) => state.setIsOpenSignupModal);
  const setIsOpenSignupAgreeModal = ModalSignupAgreeStoreStore((state) => state.setIsOpenSignupAgreeModal);
  const setFromDoctorDepth2 = DoctorFromListStore((state) => state.setFromDoctorDepth2);
  const setOpenAlert = ReviewAlertStore((state) => state.setIsOpenReviewLoginAlert);


  const userBaseInfo = useMemo(() => {
    const deCryptInfo = decryptToken(userStoreInfo)
    return userStoreInfo == null ? defaultUserInfo : typeof userStoreInfo == 'string' ? JSON.parse(deCryptInfo) : userStoreInfo;
  }, [userStoreInfo]);

  const firstForceStep = useCallback(() => {
    setChatSessionId('', null)
    setOutputCode([]); // CurrentDialogStore의 messageData를 초기화합니다.
    setIsOpenReview(false)
    setIsOpenDoctorDetailModal(false);
    setOpenHistoryDrawer(false);
    setIsOpenRequestModal(false);
    setOpenDoctorListModal(false);
    setIsOpenSetupModal(false);
    setIsOpenNoticeListModal(false);
    setIsOpenMypageRequestModal(false);
    setIsOpenEntireModal(false);
    setIsOpenPolicyModal(false);
    setIsOpenYakwanModal(false);
    setIsOpenMingamModal(false);
    setIsOpenSignupModal(false);
    setIsOpenSignupAgreeModal(false);
    setOldHistoryData(null)
    setFromDoctorDepth2(false)
    setOpenAlert(false);
    setChatDisabled({
      isState :  true,
      isAlertMsg : false,
      reTryTimeStamp : 0,
      remainTimeStamp : 0
    })
  }, [ setChatSessionId, setIsOpenReview, setIsOpenDoctorDetailModal, setOpenHistoryDrawer, setIsOpenRequestModal, setOpenDoctorListModal, setIsOpenSetupModal, setIsOpenNoticeListModal, setIsOpenMypageRequestModal, setIsOpenEntireModal, setIsOpenPolicyModal, setIsOpenYakwanModal, setIsOpenMingamModal, setIsOpenSignupModal, setIsOpenSignupAgreeModal, setOldHistoryData, setFromDoctorDepth2, setOpenAlert]);

  const getNewSessionID = useCallback(async () => {
    try {
      const res: any = await ChatService.getChatNewSession();
      if (mConstants.apiSuccessCode.includes(res?.statusCode)) {
        const newSessionId = res?.data?.session_id;
        setChatSessionId(newSessionId, null)
        return newSessionId;
      }
    } catch (e: any) {
      // handle error
    }
    return null;
  }, [setChatSessionId]);

  const addMessage = useCallback((newItem: any) => {
    if (!newItem?.isOnlyLive) {
      CurrentDialogStore.getState().setCurrentMessageData((prev: any) => [...(prev || []), { ...newItem, isLiveChat: false }]);
    }
    setRealOutputCode(prev => [...prev, newItem]);
  }, []);

  const call_fn_error_message = useCallback(async (inputCodeText: any, chat_sessinn_id: string, fromMessage: string = "") => {
    setReceiving(false);

    if (fromMessage !== 'not') {
      try {
        await ChatService.saveErrorLog(chat_sessinn_id, inputCodeText.trim(), fromMessage);
      } catch (e: any) {
        console.log("e", e)
      }
    }

    setTimeout(() => {
      addMessage({
        ismode: 'system',
        isHistory: false,
        chat_id: functions.getUUID(),
        user_question: inputCodeText,
        answer: null,
        msg: mConstants.error_message_500,
        chat_type: 'system',
        used_token: 0,
        isOnlyLive: true
      });
    }, 60);
  }, [addMessage]);

  const calculateTokenCount = (text: string): number => {
    let count = 0;
    for (let char of text) {
      const code = char.charCodeAt(0);
      if ((code >= 0xAC00 && code <= 0xD7A3) || (code >= 0x3040 && code <= 0x30FF) || (code >= 0x4E00 && code <= 0x9FFF)) {
        count += 1.2;
      } else {
        count += 0.6;
      }
    }
    return count;
  };

  const handleTranslate = useCallback(async (isText: any = '') => {
    const nowTokens = calculateTokenCount(inputCode);
    const nowTimeStamp = functions.getKSTUnixTimestamp();

    if (isNewChat) setNewChatOpen(false);
    setInputCode('');

    const maxToken = userBaseInfo?.isGuest ? guestMaxToken : userMaxToken;
    const retrySec = userBaseInfo?.isGuest ? guestRetryLimitSec : userRetryLimitSec;

    if (in24UsedToken > 0 && (in24UsedToken + nowTokens) >= maxToken) {
      setChatDisabled({
        ...isChatDisabled,
        reTryTimeStamp: nowTimeStamp,
        remainTimeStamp: retrySec ?? 57600,
        isAlertMsg: false,
        isState: false,
      });
      return;
    }

    if (functions.isEmpty(isText) || isReceiving) return;

    let chat_sessinn_id = chatSessionId;
    if (functions.isEmpty(chat_sessinn_id)) {
      chat_sessinn_id = await getNewSessionID();
    }
    const locale = (await mCookie.getCookie('currentLocale')) || 'ko';

    if (!functions.isEmpty(chat_sessinn_id)) {
        const newRequestId = Date.now();
        requestRef.current = newRequestId;
        setReceiving(true);
        addMessage({ chat_id: functions.getUUID(), ismode: "me", question: isText, isOnlyLive: false });

        try {
            const questionResult: any = await ChatService.getChatMessage(chat_sessinn_id, isText.trim(), latitude, longitude, locale);
            if (requestRef.current !== newRequestId) return;

            if (mConstants.apiSuccessCode.includes(questionResult?.statusCode)) {
                let answerMessage = questionResult?.data;

                // 복호화 로직 추가
                if (
                    process.env.NEXT_PUBLIC_DECRYPT_CHAT_PARAMETERS === 'true' &&
                    answerMessage?.encrypted_response
                ) {
                    const decryptedData = decryptResponse(answerMessage.encrypted_response);
                    if (decryptedData) {
                        // 복호화 성공 시, answerMessage를 복호화된 데이터로 교체
                        answerMessage = decryptedData;
                    } else {
                        // 복호화 실패 시, 에러 처리
                        call_fn_error_message(isText, chat_sessinn_id, "Response decryption failed.");
                        return;
                    }
                }
                
                setIn24UsedToken(answerMessage?.in24_used_token ?? 0);
                if (answerMessage?.chat_type !== 'general') {
                    setReceiving(false);
                }
                setTimeout(() => addMessage({
                    ismode: 'server',
                    isHistory: false,
                    isLiveChat: true,
                    isOnlyLive: false,
                    ...answerMessage
                }), 100);
            } else {
                // Simplified error handling
                let errorMsg = mConstants.error_message_default;
                if(questionResult?.statusCode === '408') errorMsg = mConstants.error_message_10_second;
                if(questionResult?.message?.statusCode === '506') errorMsg = mConstants.error_message_506;
                
                if (questionResult?.message?.statusCode === '401' && !functions.isEmpty(userBaseInfo?.email)) {
                    toast({ title: "비정상적인 로그인 상태입니다. 로그아웃되었습니다.", status: 'error', isClosable: true, duration: 1500 });
                    firstForceStep();
                    resetUserBasicInfo();
                } else {
                    call_fn_error_message(isText, chat_sessinn_id, "API Error");
                }
                setReceiving(false);
            }
        } catch (e: any) {
            call_fn_error_message(isText, chat_sessinn_id, `Try Catch Error: ${JSON.stringify(e)}`);
        }
    } else {
        call_fn_error_message(isText, '', "Session ID가 없습니다.");
    }
}, [inputCode, isNewChat, userBaseInfo, in24UsedToken, isReceiving, chatSessionId, getNewSessionID, addMessage, call_fn_error_message, toast, firstForceStep, resetUserBasicInfo, latitude, longitude]);


  const onHandleStopInquiry = useCallback(async () => {
    try {
      if (!functions.isEmpty(chatSessionId)) {
        await ChatService.setRequestStop(chatSessionId);
      }
    } catch (e: any) {
      // silent fail
    }
  }, [chatSessionId]);

  const onHandleStopRequest = useCallback(async () => {
    if (isReceiving) {
      requestRef.current = -1; // Invalidate current request
      await onHandleStopInquiry();
      const forceMsg = "대답이 중지되었습니다."
      setReceiving(false);
      addMessage({ chat_id: functions.getUUID(), ismode: "system_stop", msg: forceMsg });
    }
  }, [isReceiving, onHandleStopInquiry, addMessage]);

  const debouncedStopRequest = useCallback(debounce(onHandleStopRequest, 300), [onHandleStopRequest]);

  useEffect(() => {
    if (isReceiving) {
      thinkingTimerRef.current = setTimeout(() => setIsThinkingDeeply(true), 10000);
    } else {
      if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
      setIsThinkingDeeply(false);
    }
    return () => {
      if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
    };
  }, [isReceiving]);

  useEffect(() => {
    if (!functions.isEmpty(oldHistoryData)) {
      if (!functions.isEmpty(oldHistoryData?.session_id)) {
        setChatSessionId(oldHistoryData.session_id, oldHistoryData.currentDate)
        setOutputCode(oldHistoryData.chattings);
        setRealOutputCode(oldHistoryData.chattings);
        setChatDisabled(prev => ({ ...prev, isState: true, isAlertMsg: false }));
        setOpenHistoryDrawer(false);
        setOldHistoryData(null);
      }
    }
  }, [oldHistoryData, setChatSessionId, setOutputCode, setOldHistoryData, setOpenHistoryDrawer]);

  useEffect(() => {
    setIn24UsedToken(0);
  }, [userBaseInfo.isState]);

  useEffect(() => {
    const checkTokenUsage = () => {
      const now = functions.getKSTUnixTimestamp();
      const maxToken = userBaseInfo?.isGuest ? guestMaxToken : userMaxToken;
      const limitSec = userBaseInfo?.isGuest ? guestRetryLimitSec : userRetryLimitSec;

      if (in24UsedToken >= maxToken && maxToken > 0) {
        setChatDisabled({
          isState: false,
          isAlertMsg: false, // Added isAlertMsg
          reTryTimeStamp: now,
          remainTimeStamp: limitSec ?? 57600,
        });
      } else {
        setChatDisabled(prev => ({ ...prev, isState: true, isAlertMsg: false }));
      }
    };

    if (isNewChat && realOutputCode.length > 0) {
      setChatSessionId('', null);
      setOutputCode([]);
      setRealOutputCode([]);
      setCurrentPathname('');
      firstForceStep();
      setTimeout(() => setNewChatOpen(false), 60);
    } else {
      checkTokenUsage();
    }
  }, [in24UsedToken, isNewChat, userBaseInfo, guestMaxToken, userMaxToken, guestRetryLimitSec, userRetryLimitSec, firstForceStep]);


  return {
    inputCode,
    setInputCode,
    isReceiving,
    setReceiving, // Add this
    isThinkingDeeply,
    hasSent,
    setHasSent,
    realOutputCode,
    setRealOutputCode,
    isChatDisabled,
    setChatDisabled,
    in24UsedToken,
    handleTranslate,
    debouncedStopRequest,
    addMessage,
    userBaseInfo,
    chatSessionId,
    outputCode,
    firstForceStep
  };
};

