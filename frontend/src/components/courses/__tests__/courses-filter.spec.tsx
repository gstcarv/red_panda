import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockFn } from 'vitest-mock-extended';
import {
  CoursesFilter,
  type CoursesFilterValues,
} from '@/components/courses/courses-filter';

describe('CoursesFilter', () => {
  it('updates search value based on latest typed character', async () => {
    const user = userEvent.setup();
    const value: CoursesFilterValues = { search: 'Math', onlyEligible: false };
    const onChange = mockFn<(next: CoursesFilterValues) => void>();

    render(<CoursesFilter value={value} onChange={onChange} />);

    await user.type(screen.getByLabelText('Search courses'), ' 101');

    expect(onChange).toHaveBeenLastCalledWith({
      search: 'Math1',
      onlyEligible: false,
    });
  });

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = mockFn<(next: CoursesFilterValues) => void>();

    render(
      <CoursesFilter
        value={{ search: 'Math 101', onlyEligible: false }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Clear search'));

    expect(onChange).toHaveBeenLastCalledWith({
      search: '',
      onlyEligible: false,
    });
  });

  it('toggles only eligible filter', async () => {
    const user = userEvent.setup();
    const value: CoursesFilterValues = { search: '', onlyEligible: false };
    const onChange = mockFn<(next: CoursesFilterValues) => void>();

    render(<CoursesFilter value={value} onChange={onChange} />);

    await user.click(screen.getByRole('switch'));

    expect(onChange).toHaveBeenCalledWith({
      search: '',
      onlyEligible: true,
    });
  });
});
