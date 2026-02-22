import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_EXPLORE_COURSES_FILTER,
  useExploreCoursesFilterStore,
} from '@/stores/explore-courses-filter-store';

describe('useExploreCoursesFilterStore', () => {
  beforeEach(() => {
    useExploreCoursesFilterStore.getState().resetFilter();
  });

  it('toggles weekdays using normalized values', () => {
    useExploreCoursesFilterStore.getState().toggleWeekday(' Monday ');

    expect(useExploreCoursesFilterStore.getState().filter.weekdays).toEqual(['monday']);

    useExploreCoursesFilterStore.getState().toggleWeekday('MONDAY');

    expect(useExploreCoursesFilterStore.getState().filter.weekdays).toEqual([]);
  });

  it('resets all fields to default values', () => {
    useExploreCoursesFilterStore.getState().setFilter({
      search: 'math',
      fromTime: '08:00',
      untilTime: '10:00',
      weekdays: ['monday'],
    });

    useExploreCoursesFilterStore.getState().resetFilter();

    expect(useExploreCoursesFilterStore.getState().filter).toEqual(DEFAULT_EXPLORE_COURSES_FILTER);
  });
});
