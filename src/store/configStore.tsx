import { create } from "zustand";
import { devtools, persist,createJSONStorage } from 'zustand/middleware'
interface State {
    userMaxToken : number;
    userRetryLimitSec : number;
    guestMaxToken : number;
    guestRetryLimitSec : number;
    setConfigInfoStore: (userMaxToken: number, userRetryLimitSec: number, guestMaxToken: number, guestRetryLimitSec: number) => void;
}

const ConfigInfoStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                userMaxToken: 0,
                userRetryLimitSec: 0,
                guestMaxToken: 0,
                guestRetryLimitSec: 0,
                setConfigInfoStore: (userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec) => {
                    set({userMaxToken, userRetryLimitSec, guestMaxToken, guestRetryLimitSec});
                },
            }),
            { 
                name: 'ConfigInfoStore',
                //storage: createJSONStorage(() => sessionStorage)
            }
        )
    )
);

export default ConfigInfoStore;