import { api } from '@/config/api';
import type { Course } from '@/types/course.type';

export type CoursesResponse = {
  courses: Course[];
};

async function getCourses() {
  return (await api.get<CoursesResponse>('/courses')).data;
}

async function getCourseById(id: number, semesterId?: number) {
  return (
    await api.get<Course>(`/courses/${id}`, {
      params: semesterId === undefined ? undefined : { semesterId },
    })
  ).data;
}

export { getCourses, getCourseById };
