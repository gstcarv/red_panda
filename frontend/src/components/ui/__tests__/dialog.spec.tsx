import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

describe('Dialog', () => {
  it('renders dialog content when open', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Course details</DialogTitle>
          <DialogDescription>Course detail modal</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Course details')).toBeInTheDocument();
  });
});
