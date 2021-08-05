import { fieldGetter, fieldReader, fieldSetter } from '../src';

describe('package should exports assist functions', () => {
  test('export fieldGetter', () => {
    expect(fieldGetter).toBeDefined();
    expect(typeof fieldGetter === 'function').toBe(true);
  });

  test('export fieldReader', () => {
    expect(fieldReader).toBeDefined();
    expect(typeof fieldReader === 'function').toBe(true);
  });

  test('export fieldSetter', () => {
    expect(fieldSetter).toBeDefined();
    expect(typeof fieldSetter === 'function').toBe(true);
  });
});