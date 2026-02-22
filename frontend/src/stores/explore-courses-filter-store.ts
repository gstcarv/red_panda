import { create } from 'zustand';

export type ExploreCoursesFilterValues = {
  search: string;
  fromTime: string;
  untilTime: string;
  weekdays: string[];
};

type ExploreCoursesFilterStore = {
  filter: ExploreCoursesFilterValues;
  setSearch: (value: string) => void;
  setFromTime: (value: string) => void;
  setUntilTime: (value: string) => void;
  toggleWeekday: (day: string) => void;
  setFilter: (value: ExploreCoursesFilterValues) => void;
  resetFilter: () => void;
};

export const WEEKDAY_FILTER_OPTIONS = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
] as const;

export const DEFAULT_EXPLORE_COURSES_FILTER: ExploreCoursesFilterValues = {
  search: '',
  fromTime: '',
  untilTime: '',
  weekdays: [],
};

function normalizeWeekday(value: string) {
  return value.trim().toLowerCase();
}

export const useExploreCoursesFilterStore = create<ExploreCoursesFilterStore>((set) => ({
  filter: DEFAULT_EXPLORE_COURSES_FILTER,
  setSearch: (value) => set((state) => ({ filter: { ...state.filter, search: value } })),
  setFromTime: (value) => set((state) => ({ filter: { ...state.filter, fromTime: value } })),
  setUntilTime: (value) => set((state) => ({ filter: { ...state.filter, untilTime: value } })),
  toggleWeekday: (day) =>
    set((state) => {
      const normalizedDay = normalizeWeekday(day);
      const hasDay = state.filter.weekdays.includes(normalizedDay);

      return {
        filter: {
          ...state.filter,
          weekdays: hasDay
            ? state.filter.weekdays.filter((existingDay) => existingDay !== normalizedDay)
            : [...state.filter.weekdays, normalizedDay],
        },
      };
    }),
  setFilter: (value) => set({ filter: value }),
  resetFilter: () => set({ filter: DEFAULT_EXPLORE_COURSES_FILTER }),
}));
