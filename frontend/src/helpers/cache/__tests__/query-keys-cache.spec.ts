import { coursesCache } from '@/helpers/cache/courses-cache';
import { studentsCache } from '@/helpers/cache/students-cache';
import { describe, expect, it } from 'vitest';

describe('cache query keys', () => {
  it('returns stable courses query key', () => {
    expect(coursesCache.buildKey()).toEqual(['courses']);
  });

  it('returns stable student profile query key', () => {
    expect(studentsCache.buildKey()).toEqual(['student', 'me', 'profile']);
  });
});
