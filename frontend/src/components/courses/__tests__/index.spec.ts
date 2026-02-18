import { describe, expect, it } from 'vitest';
import * as courseComponents from '@/components/courses';

describe('courses public exports', () => {
  it('exposes expected components from index', () => {
    expect(courseComponents.CourseCard).toBeTypeOf('function');
    expect(courseComponents.CoursesFilter).toBeTypeOf('function');
    expect(courseComponents.CoursesList).toBeTypeOf('function');
  });
});
