
import transform from "../src";

let source: any;
beforeEach(() => {
  source = {
    a: 'fieldA',
    b: {
      c: 'field-b-c',
      d: {
        e: 'field-b-d-e'
      }
    },
    arr: []
  };
})

test('transform top level field case', () => {
  transform(source, [{ src: 'a', dest: 'newA' }]);
  expect('a' in source).toBe(false);
  expect('newA' in source).toBe(true);
  expect(source.newA).toBe('fieldA');
});

test('transform deep levels field case', () => {
  transform(source, [
    { src: 'b.c', dest: 'newB.newC' },
    { src: 'a', dest: 'b.newField' },
    { src: 'b.d.e', dest: 'newB.newD.newE' },
  ]);
  expect('b' in source).toBe(true);
  expect('c' in source?.b).toBe(false);
  expect('newB' in source).toBe(true);
  expect(typeof source.newB === 'object').toBe(true);
  expect('newC' in source?.newB).toBe(true);
  expect('d' in source?.b).toBe(true);

  expect('a' in source).toBe(false);
  expect('newField' in source.b).toBe(true);
  expect(source.b.newField).toBe('fieldA');


  expect('e' in source?.b?.d).toBe(false);
  expect('newD' in source?.newB).toBe(true);
  expect(typeof source?.newB?.newD === 'object').toBe(true);
  expect(Object.keys(source?.newB?.newD).length === 1).toBe(true);
  expect(source.newB.newD.newE).toBe('field-b-d-e');
});


test('transform to exist field', () => {
  transform(source, [
    { src: 'a', dest: 'arr' },
  ]);

  expect('a' in source).toBe(false);
  expect(source.arr).toBe('fieldA');
});


test('transform not exist field to any field', () => {
  transform(source, [
    { src: 'not-exist', dest: 'a' },
    { src: 'not-exist', dest: 'any' },
  ]);

  expect('not-exist' in source).toBe(false);
  expect('a' in source).toBe(true);
  expect(source.a).toBe(undefined);
  expect('any' in source).toBe(true);
});
