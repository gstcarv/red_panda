const WEEK_DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

type WeekDay = (typeof WEEK_DAYS)[number];

const WEEK_DAY_TO_INDEX: Record<WeekDay, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function normalizeWeekday(day: string): string {
  return day.trim().toLowerCase();
}

export function weekdayToIndex(day: string): number | null {
  const normalized = normalizeWeekday(day) as WeekDay;
  return WEEK_DAY_TO_INDEX[normalized] ?? null;
}

export function indexToWeekday(index: number): WeekDay | null {
  return WEEK_DAYS[index] ?? null;
}

export function isWeekday(day: string): day is WeekDay {
  return weekdayToIndex(day) !== null;
}

export function parseTimeToMinutes(value: string): number | null {
  const [hours, minutes] = value.split(':').map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

export function formatMinutesToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function addMinutesToTime(time: string, deltaMinutes: number): string | null {
  const current = parseTimeToMinutes(time);
  if (current === null) {
    return null;
  }

  const total = current + deltaMinutes;
  if (total < 0 || total > 24 * 60) {
    return null;
  }

  return formatMinutesToTime(total);
}

export function isTimeInRange(targetTime: string, startTime: string, endTime: string): boolean {
  const target = parseTimeToMinutes(targetTime);
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);

  if (target === null || start === null || end === null || end <= start) {
    return false;
  }

  return target >= start && target < end;
}
