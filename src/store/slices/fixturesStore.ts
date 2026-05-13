import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import type {SportId} from '../../constants/sports';

type FixturesState = {
  selectedSport: SportId;
  selectedDayKey: string;
  setSelectedSport: (s: SportId) => void;
  setSelectedDayKey: (k: string) => void;
};

export const useFixturesStore = create<FixturesState>()(
  persist(
    set => ({
      selectedSport: 'live',
      selectedDayKey: 'wed',
      setSelectedSport: s => set({selectedSport: s}),
      setSelectedDayKey: k => set({selectedDayKey: k}),
    }),
    {
      name: '@betclic/fixtures',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
