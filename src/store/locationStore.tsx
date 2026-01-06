import { create } from "zustand";
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  setLocation: (latitude: number, longitude: number) => void;
  resetLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  devtools(
    persist(
      (set) => ({
        latitude: null,
        longitude: null,
        setLocation: (latitude, longitude) => set({ latitude, longitude }),
        resetLocation: () => set({ latitude: null, longitude: null }),
      }),
      {
        name: 'LocationStore',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
