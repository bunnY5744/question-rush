import { describe, it, expect } from 'vitest';
import { accuracy, formatTime, gradeFor } from './format';
describe('format utils', () => {
  it('computes accuracy', () => { expect(accuracy(1, 3)).toBe(33.33); expect(accuracy(0, 0)).toBe(0); expect(accuracy(10, 10)).toBe(100); });
  it('formats time', () => { expect(formatTime(65)).toBe('1:05'); expect(formatTime(0)).toBe('0:00'); expect(formatTime(-5)).toBe('0:00'); });
  it('grades results', () => { expect(gradeFor(95)).toContain('Champion'); expect(gradeFor(55)).toContain('Good'); });
});
