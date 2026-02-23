import { queryOptions } from '@tanstack/react-query';
import * as studentsApi from '@/api/students-api';
import { studentsCache } from './cache';

export const getStudentProfileQuery = queryOptions({
  queryKey: studentsCache.buildStudentQueryKey(),
  queryFn: () => studentsApi.getStudentProfile(),
});
