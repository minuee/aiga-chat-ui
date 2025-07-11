import { create } from "zustand";
import { devtools, persist, createJSONStorage } from 'zustand/middleware';


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

interface TempReivewState {
    tempReviewData: any[]; // 배열로 변경
    setTempReviewData: (newData: any) => void;
    removeTempReviewData: (doctorId: number) => void;
    hasHydrated: boolean;
}

export const TempReivewStore = create<TempReivewState>()(
    devtools(
      persist(
        (set, get) => ({
          tempReviewData: [],
          setTempReviewData: (newData: any) => {
            const currentData = get().tempReviewData;
  
            // 동일한 doctor_id 있는지 확인
            const existingIndex = currentData.findIndex(
              (item: any) => item.doctor_id === newData.doctor_id
            );
  
            let updatedData;
            if (existingIndex > -1) {
              // 기존 항목 덮어쓰기
              updatedData = [...currentData];
              updatedData[existingIndex] = newData;
            } else {
              // 새 항목 추가
              updatedData = [...currentData, newData];
            }
  
            set({ tempReviewData: updatedData });
          },
          removeTempReviewData: (doctorId:string) => {
            const current = get().tempReviewData;
            const updated = current.filter((item:any) => item.doctor_id !== doctorId);
            set({ tempReviewData: updated });
          },
          hasHydrated: false,
        }),
        {
          name: 'TempReivewStore',
          storage: createJSONStorage(() => localStorage),
          onRehydrateStorage: () => (state: any) => {
            state?.set({ hasHydrated: true });
          },
        }
      )
    )
  );
  

export default HistoryStore;