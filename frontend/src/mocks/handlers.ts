import { http, HttpResponse } from "msw";
import type { Course, CourseDetails, CourseSection } from "@/types/course.type";
import type { Enrollment } from "@/types/enrollments.type";
import type {
  AvailableCoursesBySlotResponse,
  CoursesResponse,
} from "@/api/courses-api";
import type {
  EnrollParams,
  EnrollResponse,
  GetEnrollmentsResponse,
} from "@/api/enrollments-api";

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

const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    course: courses[0],
    courseSection: mockSectionsByCourseId[1][0],
  },
  {
    id: "2",
    course: courses[1],
    courseSection: mockSectionsByCourseId[2][0],
  },
];
let nextEnrollmentId = mockEnrollments.length + 1;

function normalizeDayOfWeek(dayOfWeek: string): string {
  return dayOfWeek.trim().toLowerCase();
}

function isSlotWithinMeetingTime(
  meetingTime: { dayOfWeek: string; startTime: string; endTime: string },
  weekDay: string,
  startTime: string,
) {
  return (
    normalizeDayOfWeek(meetingTime.dayOfWeek) === weekDay &&
    startTime >= meetingTime.startTime &&
    startTime < meetingTime.endTime
  );
}

export const handlers = [
  http.get("/courses", () => {
    return HttpResponse.json<CoursesResponse>({ courses });
  }),

  http.get("/courses/available", ({ request }) => {
    const { searchParams } = new URL(request.url);
    const weekDayParam = searchParams.get("weekDay");
    const startTime = searchParams.get("startTime");

    if (!weekDayParam || !startTime) {
      return HttpResponse.json<AvailableCoursesBySlotResponse>({ courses: [] });
    }

    const weekDay = normalizeDayOfWeek(weekDayParam);

    const availableCourses = courses.flatMap((course) => {
      const availableSections = (mockSectionsByCourseId[course.id] ?? []).filter(
        (section) =>
          section.meetingTimes.some((meetingTime) =>
            isSlotWithinMeetingTime(meetingTime, weekDay, startTime),
          ),
      );

      if (availableSections.length === 0) {
        return [];
      }

      return [
        {
          ...course,
          availableSections,
        },
      ];
    });

    return HttpResponse.json<AvailableCoursesBySlotResponse>({
      courses: availableCourses,
    });
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

  http.get("/enrollments", () => {
    return HttpResponse.json<GetEnrollmentsResponse>({
      enrollments: mockEnrollments,
    });
  }),

  http.post("/enrollments", async ({ request }) => {
    const body = (await request.json()) as EnrollParams;

    // Simulate error scenarios for testing
    // Uncomment to test error handling:
    // if (body.sectionId === 102) {
    //   return HttpResponse.json(
    //     { error: "Section is full" },
    //     { status: 400 }
    //   );
    // }

    const course = courses.find((value) => value.id === body.courseId);
    const courseSection = mockSectionsByCourseId[body.courseId]?.find(
      (value) => value.id === body.sectionId,
    );

    if (!course || !courseSection) {
      return HttpResponse.json(
        { error: "Course or section not found" },
        { status: 404 },
      );
    }

    const alreadyEnrolled = mockEnrollments.some(
      (enrollment) => enrollment.courseSection.id === body.sectionId,
    );
    if (alreadyEnrolled) {
      return HttpResponse.json(
        { error: "Already enrolled in this section" },
        { status: 409 },
      );
    }

    const enrollment: Enrollment = {
      id: String(nextEnrollmentId++),
      course,
      courseSection,
    };

    mockEnrollments.push(enrollment);

    return HttpResponse.json<EnrollResponse>({ enrollment });
  }),
];
