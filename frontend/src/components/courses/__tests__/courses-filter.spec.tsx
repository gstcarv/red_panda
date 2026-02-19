import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import { CoursesFilter } from '@/components/courses/courses-filter';
import type { ExploreCoursesFilterValues } from '@/hooks/courses/use-explore-courses-filter-store';

describe('CoursesFilter', () => {
  it('updates search value based on latest typed character', async () => {
    const user = userEvent.setup();
    const value: ExploreCoursesFilterValues = {
      search: 'Math',
      fromTime: '',
      untilTime: '',
      weekdays: [],
    };
    const onChange = mockFn<(next: ExploreCoursesFilterValues) => void>();

    render(<CoursesFilter value={value} onChange={onChange} />);

    await user.type(screen.getByLabelText('Search courses'), ' 101');

    expect(onChange).toHaveBeenLastCalledWith({
      search: 'Math1',
      fromTime: '',
      untilTime: '',
      weekdays: [],
    });
  });

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = mockFn<(next: ExploreCoursesFilterValues) => void>();

    render(
      <CoursesFilter
        value={{
          search: 'Math 101',
          fromTime: '',
          untilTime: '',
          weekdays: [],
        }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Clear search'));

    expect(onChange).toHaveBeenLastCalledWith({
      search: '',
      fromTime: '',
      untilTime: '',
      weekdays: [],
    });
  });

  it('updates from time value', async () => {
    const user = userEvent.setup();
    const value: ExploreCoursesFilterValues = {
      search: '',
      fromTime: '',
      untilTime: '',
      weekdays: [],
    };
    const onChange = mockFn<(next: ExploreCoursesFilterValues) => void>();

    render(<CoursesFilter value={value} onChange={onChange} />);

    await user.type(screen.getByLabelText('From time'), '09:00');

    expect(onChange).toHaveBeenLastCalledWith({
      search: '',
      fromTime: '09:00',
      untilTime: '',
      weekdays: [],
    });
  });

  it('toggles weekday filters', async () => {
    const user = userEvent.setup();
    const value: ExploreCoursesFilterValues = {
      search: '',
      fromTime: '',
      untilTime: '',
      weekdays: [],
    };
    const onChange = mockFn<(next: ExploreCoursesFilterValues) => void>();

    render(<CoursesFilter value={value} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Mon' }));

    expect(onChange).toHaveBeenCalledWith({
      search: '',
      fromTime: '',
      untilTime: '',
      weekdays: ['monday'],
    });
  });
});
