import { create } from "zustand";
import { devtools, persist,createJSONStorage } from 'zustand/middleware'

interface State {
    isNew : boolean;
    setNewChatState: (isNew: boolean) => void;
}

const NewStateStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                isNew: false,
                setNewChatState: (isNew:boolean) => {
                    set({isNew});
                },
            }),
            { 
                name: 'NewStateStore',
                storage: createJSONStorage(() => sessionStorage)
            }
        )
    )
);

export default NewStateStore;

interface CallHistoryDataStoreState {
    historyData : any;
    setOldHistoryData: (historyData: any) => void;
}

export const CallHistoryDataStore = create<CallHistoryDataStoreState>()(
    devtools(
        persist(
            (set) => ({
                historyData: null,
                setOldHistoryData: (historyData:any) => {
                    set({historyData});
                },
            }),
            { 
                name: 'CallHistoryDataStore',
                storage: createJSONStorage(() => sessionStorage)
            }
        )
    )
);




interface ChatSesseionIdStoreState {
    chatSessionId : string;
    currentHistorySelectDate: string | null;
    setChatSessionId: (chatSessionId: string, currentHistorySelectDate?: string | null) => void;
}

export const ChatSesseionIdStore = create<ChatSesseionIdStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                chatSessionId: '',
                currentHistorySelectDate: null,
                setChatSessionId: (chatSessionId:string, currentHistorySelectDate?: string | null) => {
                    set((state:ChatSesseionIdStoreState) => ({
                        chatSessionId,
                        currentHistorySelectDate: currentHistorySelectDate !== undefined ? currentHistorySelectDate : state.currentHistorySelectDate
                    }));
                },
            }),
            { 
                name: 'ChatSesseionIdStore',
                //storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);


interface CurrentDialogStoreState {
    messageData : any[];
    lastUpdated: string | null; // lastUpdated 필드 추가
    setCurrentMessageData: (messageData: any) => void;
}

export const CurrentDialogStore = create<CurrentDialogStoreState>()(
    devtools(
        persist(
            (set, get) => ({ // get 추가
                messageData: [],
                lastUpdated: null, // lastUpdated 초기값 설정
                setCurrentMessageData: (messageData: any) => {
                    set((state) => ({
                        messageData:
                            typeof messageData === 'function'
                                ? messageData(state.messageData)
                                : messageData,
                        lastUpdated: new Date().toISOString(), // messageData 업데이트 시 lastUpdated 갱신
                    }));
                }
            }),
            {
                name: 'CurrentDialogStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        const { lastUpdated, messageData } = state as CurrentDialogStoreState;

                        // lastUpdated가 없거나 (null, undefined), 3일 이상 지났으면 초기화
                        const isThreeDaysOldOrMissing = () => {
                            if (!lastUpdated) {
                                return true; // lastUpdated가 없으면 초기화 필요
                            }
                            const lastUpdatedDate = new Date(lastUpdated);
                            const threeDaysAgo = new Date();
                            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                            // Set hours, minutes, seconds, and milliseconds to 0 for a fair day-based comparison
                            lastUpdatedDate.setHours(0, 0, 0, 0);
                            threeDaysAgo.setHours(0, 0, 0, 0);
                            return lastUpdatedDate < threeDaysAgo;
                        };

                        if (isThreeDaysOldOrMissing()) {
                            // messageData와 lastUpdated 초기화
                            state.messageData = [];
                            state.lastUpdated = null;
                        }
                    }
                },
            }
        )
    )
);