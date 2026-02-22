import { describe, expect, it } from 'vitest';
import { pluralize } from '@/helpers/string-helper';

describe('string-helper', () => {
  it('returns singular when count is exactly one', () => {
    const result = pluralize(1, 'course');

    expect(result).toBe('course');
  });

  it('returns default plural when count is not one', () => {
    const result = pluralize(2, 'course');

    expect(result).toBe('courses');
  });

  it('supports custom plural forms', () => {
    const result = pluralize(0, 'person', 'people');

    expect(result).toBe('people');
  });
});
