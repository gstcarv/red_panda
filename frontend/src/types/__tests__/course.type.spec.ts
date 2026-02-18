import { describe, expectTypeOf, it } from 'vitest';
import type { Course, CourseDetails, CourseSection } from '@/types/course.type';

describe('course type contracts', () => {
  it('keeps CourseDetails compatible with Course shape', () => {
    expectTypeOf<CourseDetails>().toMatchTypeOf<Course>();
    expectTypeOf<CourseDetails['availableSections']>().toEqualTypeOf<
      CourseSection[]
    >();
  });
});
