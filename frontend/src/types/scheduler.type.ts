export type SchedulerEvent = {
  id: string;
  courseId?: number;
  title: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  isSlotHint?: boolean;
};

export type SchedulerSlotSelection = {
  weekDay: string;
  startTime: string;
  dateLabel: string;
};
