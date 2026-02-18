export type SchedulerEvent = {
  id: string;
  courseId: number;
  title: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
};
