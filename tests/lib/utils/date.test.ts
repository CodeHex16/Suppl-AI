import * as Date from '$lib/utils/date';
import { describe, it, expect } from 'vitest';

describe('Date Utility Functions', () => {
  describe('parseDate', () => {
    it('should parse a date string and return it in the correct format', () => {
      const inputDate = '2023-10-01T12:00:00Z';
      const expectedOutput = '01/10/2023';
      const result = Date.parseDate(inputDate);
      expect(result).toBe(expectedOutput);
    });

    it('should handle invalid date strings gracefully', () => {
      const inputDate = 'invalid-date-string';
      const result = Date.parseDate(inputDate);
      expect(result).toBe('Invalid Date');
    });
  });

  describe('formatData', () => {
    it('should format a date string to the correct format', () => {
      const inputDate = '2023-10-01T12:00:00Z';
      const expectedOutput = '01/10/2023, 14:00';
      const result = Date.formatData(inputDate);
      expect(result).toBe(expectedOutput);
    });

    it('should handle invalid date strings gracefully', () => {
      const inputDate = 'invalid-date-string';
      const result = Date.formatData(inputDate);
      expect(result).toBe('Invalid Date');
    });
  });
});
