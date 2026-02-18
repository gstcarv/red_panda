import { http, HttpResponse } from "msw";
import type { Course, CourseDetails, CourseSection } from "@/types/course.type";
import type { CoursesResponse } from "@/api/courses-api";

const courses: Course[] = [
  {
    id: 1,
    code: "MATH-101",
    name: "Algebra I",
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 12 },
  },
  {
    id: 2,
    code: "CS-101",
    name: "Introduction to Programming",
    credits: 4,
    hoursPerWeek: 5,
    gradeLevel: { min: 9, max: 12 },
  },
  {
    id: 3,
    code: "CS-201",
    name: "Data Structures",
    credits: 4,
    hoursPerWeek: 5,
    prerequisite: {
      id: 2,
      code: "CS-101",
      name: "Introduction to Programming",
    },
    gradeLevel: { min: 10, max: 12 },
  },
  {
    id: 4,
    code: "CS-301",
    name: "Algorithms",
    credits: 4,
    hoursPerWeek: 5,
    prerequisite: {
      id: 3,
      code: "CS-201",
      name: "Data Structures",
    },
    gradeLevel: { min: 11, max: 12 },
  },
];

const mockSectionsByCourseId: Record<number, CourseSection[]> = {
  1: [
    {
      id: 101,
      teacher: { id: 1, name: "Dr. Smith" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "09:00", endTime: "10:30" },
        { dayOfWeek: "Wednesday", startTime: "09:00", endTime: "10:30" },
      ],
      capacity: 30,
      enrolledCount: 25,
    },
    {
      id: 102,
      teacher: { id: 2, name: "Prof. Johnson" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "14:00", endTime: "15:30" },
        { dayOfWeek: "Thursday", startTime: "14:00", endTime: "15:30" },
      ],
      capacity: 25,
      enrolledCount: 20,
    },
  ],
  2: [
    {
      id: 201,
      teacher: { id: 3, name: "Dr. Williams" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "10:00", endTime: "12:00" },
        { dayOfWeek: "Wednesday", startTime: "10:00", endTime: "12:00" },
        { dayOfWeek: "Friday", startTime: "10:00", endTime: "11:00" },
      ],
      capacity: 35,
      enrolledCount: 32,
    },
    {
      id: 202,
      teacher: { id: 4, name: "Prof. Brown" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "13:00", endTime: "15:00" },
        { dayOfWeek: "Thursday", startTime: "13:00", endTime: "15:00" },
      ],
      capacity: 30,
      enrolledCount: 28,
    },
  ],
  3: [
    {
      id: 301,
      teacher: { id: 5, name: "Dr. Davis" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "13:00", endTime: "15:00" },
        { dayOfWeek: "Wednesday", startTime: "13:00", endTime: "15:00" },
      ],
      capacity: 28,
      enrolledCount: 24,
    },
  ],
  4: [
    {
      id: 401,
      teacher: { id: 6, name: "Prof. Miller" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "09:00", endTime: "11:00" },
        { dayOfWeek: "Thursday", startTime: "09:00", endTime: "11:00" },
      ],
      capacity: 25,
      enrolledCount: 22,
    },
  ],
};

export const handlers = [
  http.get("/courses", () => {
    return HttpResponse.json<CoursesResponse>({ courses });
  }),

  http.get("/courses/:id", ({ params }) => {
    const id = Number(params.id);
    const course = courses.find((c) => c.id === id);
    if (!course) return new HttpResponse(null, { status: 404 });
    const details: CourseDetails = {
      ...course,
      availableSections: mockSectionsByCourseId[id] ?? [],
    };
    return HttpResponse.json<CourseDetails>(details);
  }),
];
