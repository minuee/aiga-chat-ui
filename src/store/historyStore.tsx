import { create } from "zustand";
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
interface State {
    currentPathname : string;
    setCurrentPathname: (currentPathname: string) => void;
}

const HistoryStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                currentPathname: '',
                setCurrentPathname: (currentPathname:string) => {
                    set({currentPathname});
                },
                hasHydrated: false,
            }),
            { 
                name: 'HistoryStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);

export default HistoryStore;