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