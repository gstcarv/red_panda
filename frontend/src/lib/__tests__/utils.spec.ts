import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { cn, useMediaQuery } from '@/lib/utils';

type MatchMediaController = {
  trigger: (nextMatch: boolean) => void;
};

function mockMatchMedia(initialMatch: boolean): MatchMediaController {
  let currentMatch = initialMatch;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      get matches() {
        return currentMatch;
      },
      media: '(min-width: 768px)',
      onchange: null,
      addEventListener: (
        _: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => {
        listeners.add(listener);
      },
      removeEventListener: (
        _: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => {
        listeners.delete(listener);
      },
      dispatchEvent: () => true,
    })),
  });

  return {
    trigger(nextMatch: boolean) {
      act(() => {
        currentMatch = nextMatch;
        listeners.forEach((listener) =>
          listener({ matches: nextMatch } as MediaQueryListEvent),
        );
      });
    },
  };
}

describe('utils', () => {
  it('merges classes with tailwind conflict resolution', () => {
    expect(cn('px-2', undefined, 'px-4')).toBe('px-4');
  });

  it('returns current media query result and reacts to updates', () => {
    const controller = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    controller.trigger(true);

    expect(result.current).toBe(true);
  });
});
