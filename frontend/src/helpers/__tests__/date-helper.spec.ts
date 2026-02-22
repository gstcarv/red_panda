import { describe, expect, it } from 'vitest';
import {
  addMinutesToTime,
  formatMinutesToTime,
  indexToWeekday,
  isTimeInRange,
  isWeekday,
  normalizeWeekday,
  parseTimeToMinutes,
  weekdayToIndex,
} from '@/helpers/date-helper';

describe('date-helper', () => {
  describe('weekday helpers', () => {
    it('normalizes weekday by trimming and lowercasing', () => {
      const result = normalizeWeekday('  MonDay  ');

      expect(result).toBe('monday');
    });

    it('maps weekday names to indexes and returns null for invalid values', () => {
      const monday = weekdayToIndex('Monday');
      const invalid = weekdayToIndex('holiday');

      expect(monday).toBe(1);

      expect(invalid).toBeNull();
    });

    it('maps indexes to weekday names and returns null for out-of-range indexes', () => {
      const friday = indexToWeekday(5);
      const invalid = indexToWeekday(7);

      expect(friday).toBe('friday');

      expect(invalid).toBeNull();
    });

    it('checks whether a string is a valid weekday', () => {
      const valid = isWeekday('tuesday');
      const invalid = isWeekday('weekend');

      expect(valid).toBe(true);

      expect(invalid).toBe(false);
    });
  });

  describe('time helpers', () => {
    it('parses a valid time and rejects invalid values', () => {
      const valid = parseTimeToMinutes('09:30');
      const invalidHour = parseTimeToMinutes('24:00');
      const invalidFormat = parseTimeToMinutes('abc');

      expect(valid).toBe(570);

      expect(invalidHour).toBeNull();
      expect(invalidFormat).toBeNull();
    });

    it('formats minutes as HH:mm with leading zeros', () => {
      const zero = formatMinutesToTime(0);
      const morning = formatMinutesToTime(545);

      expect(zero).toBe('00:00');

      expect(morning).toBe('09:05');
    });

    it('adds minutes to a time and returns null when result is out of day bounds', () => {
      const plus = addMinutesToTime('10:15', 45);
      const minus = addMinutesToTime('00:15', -30);
      const overflow = addMinutesToTime('23:30', 60);
      const invalidInput = addMinutesToTime('invalid', 15);

      expect(plus).toBe('11:00');
      expect(minus).toBeNull();
      expect(overflow).toBeNull();
      expect(invalidInput).toBeNull();
    });

    it('checks whether a target time is inside a half-open range [start, end)', () => {
      const atStart = isTimeInRange('09:00', '09:00', '10:00');
      const beforeEnd = isTimeInRange('09:59', '09:00', '10:00');
      const atEnd = isTimeInRange('10:00', '09:00', '10:00');
      const invalidRange = isTimeInRange('09:30', '10:00', '09:00');

      expect(atStart).toBe(true);
      expect(beforeEnd).toBe(true);

      expect(atEnd).toBe(false);
      expect(invalidRange).toBe(false);
    });
  });
});
