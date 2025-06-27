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
    setChatSessionId: (chatSessionId: string) => void;
}

export const ChatSesseionIdStore = create<ChatSesseionIdStoreState>()(
    devtools(
        persist(
            (set) => ({
                chatSessionId: '',
                setChatSessionId: (chatSessionId:string) => {
                    set({chatSessionId});
                },
                hasHydrated: false,
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
    messageData : any;
    setCurrentMessageData: (messageData: any) => void;
}

export const CurrentDialogStore = create<CurrentDialogStoreState>()(
    devtools(
        persist(
            (set) => ({
                messageData: [],
                setCurrentMessageData: (messageData: any) => {
                set((state) => ({
                    messageData:
                    typeof messageData === 'function'
                        ? messageData(state.messageData)
                        : messageData,
                }));
                }
            }),
            { 
                name: 'CurrentDialogStore',
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);