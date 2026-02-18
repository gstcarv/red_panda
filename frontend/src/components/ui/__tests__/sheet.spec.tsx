import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';

describe('Sheet', () => {
  it('renders sheet content when open', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Mobile details</SheetTitle>
          <SheetDescription>Mobile detail panel</SheetDescription>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByText('Mobile details')).toBeInTheDocument();
  });
});
