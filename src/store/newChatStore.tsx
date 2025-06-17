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
