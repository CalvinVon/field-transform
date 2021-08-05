
import transform from "../src";

describe('test `checkType` flag', () => {
  let source: { arr: any; num?: number; obj?: {}; };
  let spy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;
  beforeEach(() => {
    source = {
      num: 1,
      obj: {},
      arr: []
    }
    spy = jest.spyOn(global.console, 'warn');
  })
  test('transform number to object', () => {

    transform(source, [
      { source: 'num', target: 'obj' },
    ], { checkType: true });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(new TypeError(`Error found while setting fields: incorrect value type of the target field 'obj'. Expecting type is [object Number], actual type is [object Object]`));
  });

  test('transform number to array', () => {

    transform(source, [
      { source: 'num', target: 'arr' },
    ], { checkType: true });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(new TypeError(`Error found while setting fields: incorrect value type of the target field 'arr'. Expecting type is [object Number], actual type is [object Array]`));
  });

  test('transform array to object', () => {

    transform(source, [
      { source: 'arr', target: 'obj' },
    ], { checkType: true });

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenLastCalledWith(new TypeError(`Error found while setting fields: incorrect value type of the target field 'obj'. Expecting type is [object Array], actual type is [object Object]`));
  });

});


describe('test `strict` flag', () => {

  test('transform number to object', () => {
    const source = {
      num: 1,
      obj: {},
      arr: []
    };
    expect(() => {
      transform(source, [
        { source: 'num', target: 'obj' },
      ], { strict: true });
    }).toThrowError(`Error found while setting fields: incorrect value type of the target field 'obj'. Expecting type is [object Number], actual type is [object Object]`);
  });
});
