const COURSES_QUERY_KEY = ['courses'] as const;

function buildCoursesQueryKey() {
  return COURSES_QUERY_KEY;
}

export const coursesCache = {
  buildKey: buildCoursesQueryKey,
};
