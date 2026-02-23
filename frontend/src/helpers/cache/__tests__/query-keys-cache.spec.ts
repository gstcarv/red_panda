import { coursesCache } from '@/queries/courses/cache';
import { studentsCache } from '@/queries/students/cache';
import { describe, expect, it } from 'vitest';

describe('cache query keys', () => {
  it('returns stable courses query key', () => {
    expect(coursesCache.buildCoursesQueryKey()).toEqual(['courses']);
  });

  it('returns stable student profile query key', () => {
    expect(studentsCache.buildStudentQueryKey()).toEqual(['student', 'me', 'profile']);
  });
});
