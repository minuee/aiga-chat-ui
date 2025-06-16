import { create } from "zustand";
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

interface ModalDoctorDetailStoreState {
    isOpenDoctorModal : boolean;
    setOpenDoctorDetailModal: (isOpenDoctorModal: boolean) => void;
}

export const ModalDoctorDetailStore = create<ModalDoctorDetailStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenDoctorModal: false,
                setOpenDoctorDetailModal: (isOpenDoctorModal:boolean) => {
                    set({isOpenDoctorModal});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalDoctorListStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);

interface DoctorFromListStoreState {
    isFromDoctorDepth2 : boolean;
    setFromDoctorDepth2: (isFromDoctorDepth2: boolean) => void;
}

export const DoctorFromListStore = create<DoctorFromListStoreState>()(
    devtools(
        persist(
            (set) => ({
                isFromDoctorDepth2: false,
                setFromDoctorDepth2: (isFromDoctorDepth2:boolean) => {
                    set({isFromDoctorDepth2});
                },
                hasHydrated: false,
            }),
            { 
                name: 'DoctorFromListStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);


interface ModalDoctorReviewStoreState {
    isOpenReview : boolean;
    setModalState: (isOpenReview: boolean) => void;
}

export const ModalDoctorReviewStore = create<ModalDoctorReviewStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenReview: false,
                setModalState: (isOpenReview:boolean) => {
                    set({isOpenReview});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalDoctorReviewStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);

interface ModalDoctorRequestStoreState {
    isOpenRequestModal : boolean;
    setModalState: (isOpenRequestModal: boolean) => void;
}

export const ModalDoctorRequestStore = create<ModalDoctorRequestStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenRequestModal: false,
                setModalState: (isOpenRequestModal:boolean) => {
                    set({isOpenRequestModal});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalDoctorRequestStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);

interface ModalDoctorListStoreState {
    isOpenDocListModal : boolean;
    setOpenDoctorListModal: (isOpenDocListModal: boolean) => void;
}

export const ModalDoctorListStore = create<ModalDoctorListStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenDocListModal: false,
                setOpenDoctorListModal: (isOpenDocListModal:boolean) => {
                    set({isOpenDocListModal});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalDoctorListStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);

interface DrawerHistoryStoreState {
    isOpenHistoryDrawer : boolean;
    setOpenHistoryDrawer: (isOpenHistoryDrawer: boolean) => void;
}

export const DrawerHistoryStore = create<DrawerHistoryStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenHistoryDrawer: false,
                setOpenHistoryDrawer: (isOpenHistoryDrawer:boolean) => {
                    set({isOpenHistoryDrawer});
                },
                hasHydrated: false,
            }),
            { 
                name: 'DrawerHistoryStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);

interface ModalMypageStoreState {
    isOpenSetupModal : boolean;
    setIsOpenSetupModal: (isOpenSetupModal: boolean) => void;
}

export const ModalMypageStore = create<ModalMypageStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenSetupModal: false,
                setIsOpenSetupModal: (isOpenSetupModal:boolean) => {
                    set({isOpenSetupModal});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalMypageStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);

interface ModalMypageNoticeListStoreState {
    isOpenNoticeListModal : boolean;
    setIsOpenNoticeListModal: (isOpenNoticeListModal: boolean) => void;
}

export const ModalMypageNoticeStore = create<ModalMypageNoticeListStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenNoticeListModal: false,
                setIsOpenNoticeListModal: (isOpenNoticeListModal:boolean) => {
                    set({isOpenNoticeListModal});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalMypageNoticeStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);


interface ModalMypageRequestStoreState {
    isOpenMypageRequestModal : boolean;
    setIsOpenMypageRequestModal: (isOpenMypageRequestModal: boolean) => void;
}

export const ModalMypageRequestStore = create<ModalMypageRequestStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenNoticeListModal: false,
                setIsOpenMypageRequestModal: (isOpenMypageRequestModal:boolean) => {
                    set({isOpenMypageRequestModal});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalMypageRequestStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);

interface ModalMypageEntireStoreState {
    isOpenEntireModal : boolean;
    setIsOpenEntireModal: (isOpenEntireModal: boolean) => void;
}

export const ModalMypageEntireStore = create<ModalMypageEntireStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenEntireModal: false,
                setIsOpenEntireModal: (isOpenEntireModal:boolean) => {
                    set({isOpenEntireModal});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalMypageEntireStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);


interface ModalMypagePolicyStoreState {
    isOpenPolicyModal : boolean;
    setIsOpenPolicyModal: (isOpenPolicyModal: boolean) => void;
}

export const ModalMypagePolicyStore = create<ModalMypagePolicyStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenPolicyModal: false,
                setIsOpenPolicyModal: (isOpenPolicyModal:boolean) => {
                    set({isOpenPolicyModal});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalMypagePolicyStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);

interface ModalMypageYakwanStoreState {
    isOpenYakwanModal : boolean;
    setIsOpenYakwanModal: (isOpenYakwanModal: boolean) => void;
}

export const ModalMypageYakwanStore = create<ModalMypageYakwanStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenYakwanModal: false,
                setIsOpenYakwanModal: (isOpenYakwanModal:boolean) => {
                    set({isOpenYakwanModal});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalMypageYakwanStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);

interface ModalSignupStoreState {
    isOpenLoginModal : boolean;
    setIsOpenSignupModal: (isOpenLoginModal: boolean) => void;
}

export const ModalSignupStoreStore = create<ModalSignupStoreState>()(
    devtools(
        persist(
            (set) => ({
                isOpenLoginModal: false,
                setIsOpenSignupModal: (isOpenLoginModal:boolean) => {
                    set({isOpenLoginModal});
                },
                hasHydrated: false,
            }),
            { 
                name: 'ModalSignupStoreStore',
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state:any) => {
                    state?.set({ hasHydrated: true });
                }
            }
        )
    )
);