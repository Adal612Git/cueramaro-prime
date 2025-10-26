import { describe, it, expect } from 'vitest';
import { colors, radius, shadow, spacing, type, tokens } from './tokens';

describe('design tokens', () => {
  it('colors.brand is #B22222', () => {
    expect(colors.brand).toBe('#B22222');
  });

  it('colors.brand600 is #a01f1f', () => {
    expect(colors.brand600).toBe('#a01f1f');
  });

  it('colors.focus is #2563EB', () => {
    expect(colors.focus).toBe('#2563EB');
  });

  it('radius sm, md, lg are 6,10,14', () => {
    expect(radius.sm).toBe(6);
    expect(radius.md).toBe(10);
    expect(radius.lg).toBe(14);
  });

  it('shadow.card matches expected', () => {
    expect(shadow.card).toBe('0 8px 18px rgba(17,24,39,.08)');
  });

  it('spacing has required keys', () => {
    expect(spacing).toHaveProperty('xs');
    expect(spacing).toHaveProperty('sm');
    expect(spacing).toHaveProperty('md');
    expect(spacing).toHaveProperty('lg');
    expect(spacing).toHaveProperty('xl');
    expect(spacing).toHaveProperty('2xl');
  });

  it('type.price is 22', () => {
    expect(type.price).toBe(22);
  });

  it('tokens aggregate export is consistent', () => {
    expect(tokens.colors.brand).toBe(colors.brand);
    expect(tokens.radius.md).toBe(radius.md);
    expect(tokens.shadow.card).toBe(shadow.card);
    expect(tokens.spacing.xl).toBe(spacing.xl);
    expect(tokens.type.h1).toBe(type.h1);
  });

  it('all colors are valid hex codes', () => {
    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
    Object.values(colors).forEach((v) => {
      expect(hex.test(v)).toBeTruthy();
    });
  });

  it('no undefined values in tokens', () => {
    const hasUndefined = (obj: any): boolean => {
      return Object.values(obj).some((v) =>
        typeof v === 'object' && v !== null ? hasUndefined(v) : v === undefined,
      );
    };
    expect(hasUndefined(tokens)).toBe(false);
  });
});
