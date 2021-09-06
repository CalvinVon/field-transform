import { fieldGetter, fieldReader } from '../src';

describe('function `fieldGetter` should works well when called alone', () => {
  test('get field from object', () => {
    const obj = {
      a: 1,
      b: {},
      c: []
    };

    const aRes = fieldGetter(obj, 'a', { delete: false });
    const bRes = fieldGetter(obj, 'b', { delete: false });
    const cRes = fieldGetter(obj, 'c', { delete: false });

    expect(aRes.length === 1).toBe(true);
    expect(bRes.length === 1).toBe(true);
    expect(cRes.length === 1).toBe(true);

    expect(aRes[0].data === obj.a).toBe(true);
    expect(aRes[0].field === 'a').toBe(true);
    expect(aRes[0].parent === obj).toBe(true);
    expect(aRes[0].path).toEqual(['a']);

    expect(bRes[0].data === obj.b).toBe(true);
    expect(cRes[0].data === obj.c).toBe(true);
  });

  test('get field from array', () => {
    const arr = [
      { index: 1 },
      { index: 2 },
    ];

    const res = fieldGetter(arr, '[].index', { delete: false });

    expect(res.length === 2).toBe(true);

    expect(res[0].data === arr[0].index).toBe(true);
    expect(res[0].field === '[].index').toBe(true);
    expect(res[0].parent).toEqual(arr[0]);
    expect(res[0].path).toEqual(['0', 'index']);

    expect(res[1].data === arr[1].index).toBe(true);
    expect(res[1].parent).toEqual(arr[1]);
    expect(res[1].path).toEqual(['1', 'index']);
  });

});

describe('function `fieldReader` should works well when called alone', () => {
  test('set field of object', () => {
    const obj = { field: 'field' };

    const res = fieldReader(obj, 'field');

    expect(Array.isArray(res)).toBe(true);
    expect(res.length === 1).toBe(true);
    expect(res[0].data).toEqual('field');
  });

});