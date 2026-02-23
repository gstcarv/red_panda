export function buildCoursesQueryKey() {
  return ['courses'] as const;
}

export function buildCourseHistoryQueryKey() {
  return ['me', 'courses', 'history'] as const;
}

export function buildCourseByIdQueryKey(courseId: number | null, semesterId: number | null = null) {
  return ['course', courseId, semesterId] as const;
}

export const coursesCache = {
  buildCoursesQueryKey,
  buildCourseByIdQueryKey,
  buildCourseHistoryQueryKey,
};
