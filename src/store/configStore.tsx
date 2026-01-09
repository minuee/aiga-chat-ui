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

interface GlobalStateStoreState {
    isGlobalState : boolean;
    setGlobalState: (isGlobalState: boolean) => void;
    hasHydrated: boolean;
    setHasHydrated: (hydrated: boolean) => void;
}


export const GlobalStateStore = create<GlobalStateStoreState>()(
    devtools(
        persist(
            (set) => ({
                isGlobalState: true,
                setGlobalState: (isGlobalState: boolean) => {
                    set((prev:GlobalStateStoreState) =>
                      prev.isGlobalState === isGlobalState
                        ? prev
                        : { isGlobalState }
                    )
                },
                hasHydrated: false,
                setHasHydrated: (hydrated: boolean) => {
                    set({ hasHydrated: hydrated });
                },
            }),
            { 
                name: 'GlobalStateStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state: any) => {
                    state?.setHasHydrated(true);
                }
            }
        )
    )
);

interface GlobalLocationStoreState {
    locationPermissionState : 'prompt' | 'granted' | 'denied' | 'dont_ask';
    setLocationPermissionState: (state: 'prompt' | 'granted' | 'denied' | 'dont_ask') => void;
    hasHydrated: boolean;
    setHasHydrated: (hydrated: boolean) => void;
}

export const GlobalLocationStore = create<GlobalLocationStoreState>()(
    devtools(
        persist(
            (set) => ({
                locationPermissionState: 'prompt', // Initial state
                setLocationPermissionState: (locationPermissionState: 'prompt' | 'granted' | 'denied' | 'dont_ask') => {
                    set((prev: GlobalLocationStoreState) =>
                        prev.locationPermissionState === locationPermissionState
                            ? prev
                            : { locationPermissionState }
                    );
                },
                hasHydrated: false,
                setHasHydrated: (hydrated: boolean) => {
                    set({ hasHydrated: hydrated });
                },
            }),
            {
                name: 'GlobalLocationStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state: any) => {
                    state?.setHasHydrated(true);
                },
            }
        )
    )
);

