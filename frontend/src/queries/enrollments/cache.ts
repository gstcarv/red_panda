import merge from 'lodash.merge';
import type { GetStudentEnrollmentsResponse } from '@/api/students-api';
import { queryClient } from '@/lib/react-query';
import type { Enrollment } from '@/types/enrollments.type';

export function buildEnrollmentQueryKey() {
  return ['me', 'enrollments'] as const;
}

function addEnrollment({ enrollment }: { enrollment: Enrollment }) {
  queryClient.setQueryData<GetStudentEnrollmentsResponse>(buildEnrollmentQueryKey(), (current) => {
    if (!current) {
      return current;
    }

    const alreadyExists = current.enrollments.some(
      (value) => value.courseSection.id === enrollment.courseSection.id,
    );

    if (alreadyExists) {
      return current;
    }

    return merge({}, current, {
      enrollments: [...current.enrollments, enrollment],
    });
  });
}

function removeEnrollmentByCourseId({ courseId }: { courseId: number }) {
  queryClient.setQueryData<GetStudentEnrollmentsResponse>(buildEnrollmentQueryKey(), (current) => {
    if (!current) {
      return current;
    }

    const nextEnrollments = current.enrollments.filter(
      (enrollment) => enrollment.course.id !== courseId,
    );

    return {
      ...current,
      enrollments: nextEnrollments,
    };
  });
}

function invalidate() {
  return queryClient.invalidateQueries({
    queryKey: buildEnrollmentQueryKey(),
  });
}

export const enrollmentsCache = {
  buildEnrollmentQueryKey,
  addEnrollment,
  removeEnrollmentByCourseId,
  invalidate,
};
