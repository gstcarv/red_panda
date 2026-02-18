import { describe, expectTypeOf, it } from 'vitest';
import type { Course, CourseSection } from '@/types/course.type';

describe('course type contracts', () => {
  it('keeps Course available sections typed', () => {
    expectTypeOf<Course['availableSections']>().toEqualTypeOf<CourseSection[]>();
  });
});
