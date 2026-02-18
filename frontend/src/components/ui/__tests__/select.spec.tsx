import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

describe('Select', () => {
  it('renders trigger and placeholder value', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Grade level">
          <SelectValue placeholder="Choose a grade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="9">Grade 9</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox', { name: 'Grade level' })).toBeInTheDocument();
    expect(screen.getByText('Choose a grade')).toBeInTheDocument();
  });
});
