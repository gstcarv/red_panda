const STUDENT_QUERY_KEY = ['student', 'me', 'profile'] as const;

function buildStudentQueryKey() {
  return STUDENT_QUERY_KEY;
}

export const studentsCache = {
  buildKey: buildStudentQueryKey,
};
