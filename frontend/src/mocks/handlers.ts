import { http, HttpResponse } from "msw";
import type { Course, CourseSection } from "@/types/course.type";
import type { CourseHistory } from "@/types/course-history.type";
import type { Enrollment } from "@/types/enrollments.type";
import type { Student } from "@/types/student.type";
import type {
  CoursesResponse,
} from "@/api/courses-api";
import type {
  EnrollParams,
  EnrollResponse,
  GetEnrollmentsResponse,
} from "@/api/enrollments-api";
import type {
  GetStudentCourseHistoryResponse,
  GetStudentProfileResponse,
} from "@/api/students-api";

const courses: Course[] = [
  {
    id: 1,
    code: "MATH-101",
    name: "Algebra I",
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [],
  },
  {
    id: 2,
    code: "CS-101",
    name: "Introduction to Programming",
    credits: 4,
    hoursPerWeek: 5,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [],
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
    availableSections: [],
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
    availableSections: [],
  },
  {
    id: 5,
    code: "MATH-201",
    name: "Geometry",
    credits: 3,
    hoursPerWeek: 4,
    prerequisite: {
      id: 1,
      code: "MATH-101",
      name: "Algebra I",
    },
    gradeLevel: { min: 10, max: 12 },
    availableSections: [],
  },
  {
    id: 6,
    code: "MATH-301",
    name: "Pre-Calculus",
    credits: 4,
    hoursPerWeek: 5,
    prerequisite: {
      id: 5,
      code: "MATH-201",
      name: "Geometry",
    },
    gradeLevel: { min: 11, max: 12 },
    availableSections: [],
  },
  {
    id: 7,
    code: "PHYS-101",
    name: "Physics I",
    credits: 4,
    hoursPerWeek: 5,
    gradeLevel: { min: 10, max: 12 },
    availableSections: [],
  },
  {
    id: 8,
    code: "CHEM-101",
    name: "Chemistry I",
    credits: 4,
    hoursPerWeek: 5,
    gradeLevel: { min: 10, max: 12 },
    availableSections: [],
  },
  {
    id: 9,
    code: "BIO-101",
    name: "Biology I",
    credits: 4,
    hoursPerWeek: 5,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [],
  },
  {
    id: 10,
    code: "ENG-101",
    name: "English Literature",
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [],
  },
  {
    id: 11,
    code: "ENG-201",
    name: "Advanced Composition",
    credits: 3,
    hoursPerWeek: 4,
    prerequisite: {
      id: 10,
      code: "ENG-101",
      name: "English Literature",
    },
    gradeLevel: { min: 10, max: 12 },
    availableSections: [],
  },
  {
    id: 12,
    code: "HIST-101",
    name: "World History",
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [],
  },
  {
    id: 13,
    code: "HIST-201",
    name: "US History",
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: { min: 10, max: 12 },
    availableSections: [],
  },
  {
    id: 14,
    code: "ART-101",
    name: "Introduction to Art",
    credits: 2,
    hoursPerWeek: 3,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [],
  },
  {
    id: 15,
    code: "MUS-101",
    name: "Music Theory",
    credits: 2,
    hoursPerWeek: 3,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [],
  },
  {
    id: 16,
    code: "SPAN-101",
    name: "Spanish I",
    credits: 3,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 12 },
    availableSections: [],
  },
  {
    id: 17,
    code: "SPAN-201",
    name: "Spanish II",
    credits: 3,
    hoursPerWeek: 4,
    prerequisite: {
      id: 16,
      code: "SPAN-101",
      name: "Spanish I",
    },
    gradeLevel: { min: 10, max: 12 },
    availableSections: [],
  },
  {
    id: 18,
    code: "PHYS-201",
    name: "Physics II",
    credits: 4,
    hoursPerWeek: 5,
    prerequisite: {
      id: 7,
      code: "PHYS-101",
      name: "Physics I",
    },
    gradeLevel: { min: 11, max: 12 },
    availableSections: [],
  },
  {
    id: 19,
    code: "CS-401",
    name: "Software Engineering",
    credits: 4,
    hoursPerWeek: 5,
    prerequisite: {
      id: 4,
      code: "CS-301",
      name: "Algorithms",
    },
    gradeLevel: { min: 12, max: 12 },
    availableSections: [],
  },
  {
    id: 20,
    code: "MATH-401",
    name: "Calculus",
    credits: 4,
    hoursPerWeek: 5,
    prerequisite: {
      id: 6,
      code: "MATH-301",
      name: "Pre-Calculus",
    },
    gradeLevel: { min: 12, max: 12 },
    availableSections: [],
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
  5: [
    {
      id: 501,
      teacher: { id: 7, name: "Dr. Anderson" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "11:00", endTime: "12:30" },
        { dayOfWeek: "Wednesday", startTime: "11:00", endTime: "12:30" },
        { dayOfWeek: "Friday", startTime: "11:00", endTime: "11:50" },
      ],
      capacity: 30,
      enrolledCount: 28,
    },
    {
      id: 502,
      teacher: { id: 8, name: "Prof. Taylor" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "10:00", endTime: "11:30" },
        { dayOfWeek: "Thursday", startTime: "10:00", endTime: "11:30" },
      ],
      capacity: 28,
      enrolledCount: 25,
    },
  ],
  6: [
    {
      id: 601,
      teacher: { id: 9, name: "Dr. Martinez" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "14:00", endTime: "15:30" },
        { dayOfWeek: "Wednesday", startTime: "14:00", endTime: "15:30" },
        { dayOfWeek: "Friday", startTime: "14:00", endTime: "14:50" },
      ],
      capacity: 25,
      enrolledCount: 23,
    },
  ],
  7: [
    {
      id: 701,
      teacher: { id: 10, name: "Dr. Thompson" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "08:00", endTime: "10:00" },
        { dayOfWeek: "Wednesday", startTime: "08:00", endTime: "10:00" },
      ],
      capacity: 30,
      enrolledCount: 27,
    },
    {
      id: 702,
      teacher: { id: 11, name: "Prof. Garcia" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "15:00", endTime: "17:00" },
        { dayOfWeek: "Thursday", startTime: "15:00", endTime: "17:00" },
      ],
      capacity: 28,
      enrolledCount: 24,
    },
  ],
  8: [
    {
      id: 801,
      teacher: { id: 12, name: "Dr. Rodriguez" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "13:00", endTime: "15:00" },
        { dayOfWeek: "Wednesday", startTime: "13:00", endTime: "15:00" },
      ],
      capacity: 32,
      enrolledCount: 30,
    },
  ],
  9: [
    {
      id: 901,
      teacher: { id: 13, name: "Dr. Lee" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "09:00", endTime: "11:00" },
        { dayOfWeek: "Thursday", startTime: "09:00", endTime: "11:00" },
      ],
      capacity: 35,
      enrolledCount: 32,
    },
    {
      id: 902,
      teacher: { id: 14, name: "Prof. White" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "10:00", endTime: "12:00" },
        { dayOfWeek: "Friday", startTime: "10:00", endTime: "12:00" },
      ],
      capacity: 30,
      enrolledCount: 28,
    },
  ],
  10: [
    {
      id: 1001,
      teacher: { id: 15, name: "Dr. Harris" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "09:00", endTime: "10:30" },
        { dayOfWeek: "Wednesday", startTime: "09:00", endTime: "10:30" },
        { dayOfWeek: "Friday", startTime: "09:00", endTime: "09:50" },
      ],
      capacity: 25,
      enrolledCount: 22,
    },
    {
      id: 1002,
      teacher: { id: 16, name: "Prof. Clark" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "11:00", endTime: "12:30" },
        { dayOfWeek: "Thursday", startTime: "11:00", endTime: "12:30" },
      ],
      capacity: 25,
      enrolledCount: 20,
    },
  ],
  11: [
    {
      id: 1101,
      teacher: { id: 17, name: "Dr. Lewis" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "15:00", endTime: "16:30" },
        { dayOfWeek: "Wednesday", startTime: "15:00", endTime: "16:30" },
      ],
      capacity: 20,
      enrolledCount: 18,
    },
  ],
  12: [
    {
      id: 1201,
      teacher: { id: 18, name: "Dr. Walker" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "08:00", endTime: "09:30" },
        { dayOfWeek: "Thursday", startTime: "08:00", endTime: "09:30" },
      ],
      capacity: 30,
      enrolledCount: 28,
    },
    {
      id: 1202,
      teacher: { id: 19, name: "Prof. Hall" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "14:00", endTime: "15:30" },
        { dayOfWeek: "Wednesday", startTime: "14:00", endTime: "15:30" },
      ],
      capacity: 28,
      enrolledCount: 25,
    },
  ],
  13: [
    {
      id: 1301,
      teacher: { id: 20, name: "Dr. Allen" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "13:00", endTime: "14:30" },
        { dayOfWeek: "Thursday", startTime: "13:00", endTime: "14:30" },
      ],
      capacity: 30,
      enrolledCount: 27,
    },
  ],
  14: [
    {
      id: 1401,
      teacher: { id: 21, name: "Prof. Young" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "15:00", endTime: "17:00" },
      ],
      capacity: 20,
      enrolledCount: 18,
    },
    {
      id: 1402,
      teacher: { id: 22, name: "Dr. King" },
      meetingTimes: [
        { dayOfWeek: "Wednesday", startTime: "15:00", endTime: "17:00" },
      ],
      capacity: 20,
      enrolledCount: 15,
    },
  ],
  15: [
    {
      id: 1501,
      teacher: { id: 23, name: "Prof. Wright" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "15:00", endTime: "17:00" },
      ],
      capacity: 25,
      enrolledCount: 22,
    },
  ],
  16: [
    {
      id: 1601,
      teacher: { id: 24, name: "Dr. Lopez" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "11:00", endTime: "12:30" },
        { dayOfWeek: "Wednesday", startTime: "11:00", endTime: "12:30" },
        { dayOfWeek: "Friday", startTime: "11:00", endTime: "11:50" },
      ],
      capacity: 25,
      enrolledCount: 23,
    },
    {
      id: 1602,
      teacher: { id: 25, name: "Prof. Hill" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "14:00", endTime: "15:30" },
        { dayOfWeek: "Thursday", startTime: "14:00", endTime: "15:30" },
      ],
      capacity: 25,
      enrolledCount: 20,
    },
  ],
  17: [
    {
      id: 1701,
      teacher: { id: 24, name: "Dr. Lopez" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "13:00", endTime: "14:30" },
        { dayOfWeek: "Wednesday", startTime: "13:00", endTime: "14:30" },
        { dayOfWeek: "Friday", startTime: "13:00", endTime: "13:50" },
      ],
      capacity: 20,
      enrolledCount: 18,
    },
  ],
  18: [
    {
      id: 1801,
      teacher: { id: 10, name: "Dr. Thompson" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "08:00", endTime: "10:00" },
        { dayOfWeek: "Thursday", startTime: "08:00", endTime: "10:00" },
      ],
      capacity: 25,
      enrolledCount: 22,
    },
  ],
  19: [
    {
      id: 1901,
      teacher: { id: 3, name: "Dr. Williams" },
      meetingTimes: [
        { dayOfWeek: "Monday", startTime: "10:00", endTime: "12:00" },
        { dayOfWeek: "Wednesday", startTime: "10:00", endTime: "12:00" },
        { dayOfWeek: "Friday", startTime: "10:00", endTime: "11:00" },
      ],
      capacity: 20,
      enrolledCount: 18,
    },
  ],
  20: [
    {
      id: 2001,
      teacher: { id: 9, name: "Dr. Martinez" },
      meetingTimes: [
        { dayOfWeek: "Tuesday", startTime: "11:00", endTime: "13:00" },
        { dayOfWeek: "Thursday", startTime: "11:00", endTime: "13:00" },
      ],
      capacity: 22,
      enrolledCount: 20,
    },
  ],
};

function toCourseWithSections(course: Course): Course {
  return {
    ...course,
    availableSections: mockSectionsByCourseId[course.id] ?? [],
  };
}

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

const mockCourseHistory: CourseHistory[] = [
  {
    id: 1,
    courseId: 1,
    courseName: "Algebra I",
    semesterId: 1,
    status: "passed",
  },
  {
    id: 2,
    courseId: 2,
    courseName: "Introduction to Programming",
    semesterId: 1,
    status: "passed",
  },
  {
    id: 3,
    courseId: 3,
    courseName: "Data Structures",
    semesterId: 2,
    status: "failed",
  },
];

const mockStudent: Student = {
  id: 1,
  firstName: "Alex",
  lastName: "Johnson",
  gradeLevel: 11,
  email: "alex.johnson@example.com",
  gpa: 3.7,
  credits: {
    earned: 30,
    max: 44,
  },
  options: {
    maxCoursesPerSemester: 5,
  },
};

export const handlers = [
  http.get("/courses", () => {
    return HttpResponse.json<CoursesResponse>({
      courses: courses.map(toCourseWithSections),
    });
  }),

  http.get("/courses/:id", ({ params }) => {
    const id = Number(params.id);
    const course = courses.find((c) => c.id === id);

    if (!course) return new HttpResponse(null, { status: 404 });

    const details: Course = toCourseWithSections(course);

    return HttpResponse.json<Course>(details);
  }),

  http.get("/enrollments", () => {
    return HttpResponse.json<GetEnrollmentsResponse>({
      enrollments: mockEnrollments,
    });
  }),

  http.get("/students/:studentId/courses/history", ({ params }) => {
    const studentId = Number(params.studentId);
    if (Number.isNaN(studentId)) return new HttpResponse(null, { status: 400 });

    return HttpResponse.json<GetStudentCourseHistoryResponse>({
      courseHistory: mockCourseHistory,
    });
  }),

  http.get("/student/:id/profile", ({ params }) => {
    const id = Number(params.id);
    if (Number.isNaN(id)) return new HttpResponse(null, { status: 400 });

    return HttpResponse.json<GetStudentProfileResponse>({
      student: {
        ...mockStudent,
        id,
      },
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
    mockStudent.credits.earned += course.credits;

    return HttpResponse.json<EnrollResponse>({ enrollment });
  }),

  http.delete("/enrollments/:id", ({ params }) => {
    const enrollmentId = String(params.id);
    const enrollmentIndex = mockEnrollments.findIndex(
      (value) => value.id === enrollmentId,
    );

    if (enrollmentIndex === -1) {
      return HttpResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }

    const [removedEnrollment] = mockEnrollments.splice(enrollmentIndex, 1);
    mockStudent.credits.earned = Math.max(
      0,
      mockStudent.credits.earned - removedEnrollment.course.credits,
    );

    return HttpResponse.json({
      enrollment: removedEnrollment,
    });
  }),
];
