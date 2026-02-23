export function buildStudentQueryKey() {
  return ['student', 'me', 'profile'] as const;
}

export const studentsCache = {
  buildStudentQueryKey,
};
