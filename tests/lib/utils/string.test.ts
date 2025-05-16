import * as stringUtils from '$lib/utils/string';

import { describe, it, expect } from 'vitest';

describe('String Utility Functions', () => {
  describe('abbrWithEllipsis', () => {
    it('should abbreviate a string with ellipsis if it exceeds the max length', () => {
      const input = 'This is a long string that needs to be abbreviated.';
      const maxLength = 20;
      const expectedOutput = 'This is a long strin…';
      const result = stringUtils.abbrWithEllipsis(input, maxLength);
      expect(result).toBe(expectedOutput);
    });

    it('should return the original string if it does not exceed the max length', () => {
      const input = 'Short string';
      const maxLength = 20;
      const result = stringUtils.abbrWithEllipsis(input, maxLength);
      expect(result).toBe(input);
    });
  });
});
