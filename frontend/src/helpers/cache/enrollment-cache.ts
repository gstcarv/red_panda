import merge from 'lodash.merge';
import type { QueryClient } from '@tanstack/react-query';
import type { GetStudentEnrollmentsResponse } from '@/api/students-api';
import type { Enrollment } from '@/types/enrollments.type';

const ENROLLMENTS_QUERY_KEY = ['me', 'enrollments'] as const;

function buildEnrollmentQueryKey() {
  return ENROLLMENTS_QUERY_KEY;
}

function addEnrollment({
  queryClient,
  enrollment,
}: {
  queryClient: QueryClient;
  enrollment: Enrollment;
}) {
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

function removeEnrollmentByCourseId({
  queryClient,
  courseId,
}: {
  queryClient: QueryClient;
  courseId: number;
}) {
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

function invalidate({ queryClient }: { queryClient: QueryClient }) {
  return queryClient.invalidateQueries({
    queryKey: buildEnrollmentQueryKey(),
  });
}

export const enrollmentsCache = {
  buildKey: buildEnrollmentQueryKey,
  addEnrollment,
  removeEnrollmentByCourseId,
  invalidate,
};
