import * as studentsApi from '@/api/students-api';
import { getStudentProfileQuery } from '@/queries/students/query';
import { describe, expect, it, vi } from 'vitest';

describe('students query options', () => {
  it('builds stable student profile query options', async () => {
    const profileSpy = vi.spyOn(studentsApi, 'getStudentProfile').mockResolvedValue({} as never);

    expect(getStudentProfileQuery.queryKey).toEqual(['student', 'me', 'profile']);
    await getStudentProfileQuery.queryFn!({} as never);

    expect(profileSpy).toHaveBeenCalledTimes(1);
  });
});
