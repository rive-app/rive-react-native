import { isEnum } from '../helpers';

describe('isEnum function', () => {
  enum TestEnum {
    ValueA = 'A',
    ValueB = 'B',
    ValueC = 'C',
  }

  it('should return true for a valid enum value', () => {
    expect(isEnum(TestEnum, 'A')).toBe(true);
    expect(isEnum(TestEnum, 'B')).toBe(true);
    expect(isEnum(TestEnum, 'C')).toBe(true);
  });

  it('should return false for an invalid enum value', () => {
    expect(isEnum(TestEnum, 'D')).toBe(false);
    expect(isEnum(TestEnum, 'E')).toBe(false);
    expect(isEnum(TestEnum, '')).toBe(false);
    expect(isEnum(TestEnum, 'ValueB')).toBe(false);
  });

  it('should handle non-string inputs gracefully', () => {
    expect(isEnum(TestEnum, null as any)).toBe(false);
    expect(isEnum(TestEnum, undefined as any)).toBe(false);
    expect(isEnum(TestEnum, 123 as any)).toBe(false);
  });
});
