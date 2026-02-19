import { create } from "zustand";
import { devtools, persist,createJSONStorage } from 'zustand/middleware'

interface State {
    isNew : boolean;
    lastUpdated: string | null;
    setNewChatState: (isNew: boolean) => void;
}

const NewStateStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                isNew: false,
                lastUpdated: null,
                setNewChatState: (isNew:boolean) => {
                    set({
                        isNew,
                        lastUpdated: new Date().toISOString()
                    });
                },
            }),
            { 
                name: 'NewStateStore',
                storage: createJSONStorage(() => localStorage), // 3일 관리를 위해 localStorage로 변경
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        const { lastUpdated } = state as State;
                        const isThreeDaysOldOrMissing = () => {
                            if (!lastUpdated) return true;
                            const lastUpdatedDate = new Date(lastUpdated);
                            const threeDaysAgo = new Date();
                            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                            lastUpdatedDate.setHours(0, 0, 0, 0);
                            threeDaysAgo.setHours(0, 0, 0, 0);
                            return lastUpdatedDate < threeDaysAgo;
                        };

                        if (isThreeDaysOldOrMissing()) {
                            state.isNew = true; // 만료 시 신규 대화 상태로 강제 전환
                            state.lastUpdated = null;
                        }
                    }
                }
            }
        )
    )
);

export default NewStateStore;

interface CallHistoryDataStoreState {
    historyData : any;
    lastUpdated: string | null;
    setOldHistoryData: (historyData: any) => void;
}

export const CallHistoryDataStore = create<CallHistoryDataStoreState>()(
    devtools(
        persist(
            (set) => ({
                historyData: null,
                lastUpdated: null,
                setOldHistoryData: (historyData:any) => {
                    set({
                        historyData,
                        lastUpdated: new Date().toISOString()
                    });
                },
            }),
            { 
                name: 'CallHistoryDataStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        const { lastUpdated } = state as CallHistoryDataStoreState;
                        const isThreeDaysOldOrMissing = () => {
                            if (!lastUpdated) return true;
                            const lastUpdatedDate = new Date(lastUpdated);
                            const threeDaysAgo = new Date();
                            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                            lastUpdatedDate.setHours(0, 0, 0, 0);
                            threeDaysAgo.setHours(0, 0, 0, 0);
                            return lastUpdatedDate < threeDaysAgo;
                        };

                        if (isThreeDaysOldOrMissing()) {
                            state.historyData = null;
                            state.lastUpdated = null;
                        }
                    }
                }
            }
        )
    )
);




interface ChatSesseionIdStoreState {
    chatSessionId : string;
    currentHistorySelectDate: string | null;
    lastUpdated: string | null; // lastUpdated 추가
    setChatSessionId: (chatSessionId: string, currentHistorySelectDate?: string | null) => void;
}

export const ChatSesseionIdStore = create<ChatSesseionIdStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                chatSessionId: '',
                currentHistorySelectDate: null,
                lastUpdated: null, // 초기값
                setChatSessionId: (chatSessionId:string, currentHistorySelectDate?: string | null) => {
                    set((state:ChatSesseionIdStoreState) => ({
                        chatSessionId,
                        currentHistorySelectDate: currentHistorySelectDate !== undefined ? currentHistorySelectDate : state.currentHistorySelectDate,
                        lastUpdated: new Date().toISOString(), // ID 설정 시 시간 갱신
                    }));
                },
            }),
            { 
                name: 'ChatSesseionIdStore',
                storage: createJSONStorage(() => localStorage), // 명시적으로 localStorage 설정
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        const { lastUpdated } = state as ChatSesseionIdStoreState;
                        
                        const isThreeDaysOldOrMissing = () => {
                            if (!lastUpdated) return true;
                            const lastUpdatedDate = new Date(lastUpdated);
                            const threeDaysAgo = new Date();
                            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                            lastUpdatedDate.setHours(0, 0, 0, 0);
                            threeDaysAgo.setHours(0, 0, 0, 0);
                            return lastUpdatedDate < threeDaysAgo;
                        };

                        if (isThreeDaysOldOrMissing()) {
                            // 세션 정보 초기화
                            state.chatSessionId = '';
                            state.currentHistorySelectDate = null;
                            state.lastUpdated = null;
                        }
                    }
                }
            }
        )
    )
);


interface CurrentDialogStoreState {
    messageData : any[];
    lastUpdated: string | null;
    setCurrentMessageData: (messageData: any) => void;
}

export const CurrentDialogStore = create<CurrentDialogStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                messageData: [],
                lastUpdated: null,
                setCurrentMessageData: (messageData: any) => {
                    set((state) => ({
                        messageData:
                            typeof messageData === 'function'
                                ? messageData(state.messageData)
                                : messageData,
                        lastUpdated: new Date().toISOString(),
                    }));
                }
            }),
            {
                name: 'CurrentDialogStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        const { lastUpdated } = state as CurrentDialogStoreState;

                        const isThreeDaysOldOrMissing = () => {
                            if (!lastUpdated) return true;
                            const lastUpdatedDate = new Date(lastUpdated);
                            const threeDaysAgo = new Date();
                            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                            lastUpdatedDate.setHours(0, 0, 0, 0);
                            threeDaysAgo.setHours(0, 0, 0, 0);
                            return lastUpdatedDate < threeDaysAgo;
                        };

                        if (isThreeDaysOldOrMissing()) {
                            state.messageData = [];
                            state.lastUpdated = null;
                        }
                    }
                },
            }
        )
    )
);