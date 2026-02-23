import { buildStudentQueryKey, studentsCache } from '@/queries/students/cache';
import { describe, expect, it } from 'vitest';

describe('students cache', () => {
  it('builds a stable student query key', () => {
    expect(buildStudentQueryKey()).toEqual(['student', 'me', 'profile']);
    expect(studentsCache.buildStudentQueryKey()).toEqual(['student', 'me', 'profile']);
  });
});
