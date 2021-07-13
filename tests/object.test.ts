
import transform from "../src";

// const source = {
//   prop: 'prop',
//   data: {
//     a: 'data-a',
//     // b: null
//     b: {
//       c: 'data-C',
//       other: 'origin'
//     }
//   },
//   newData: {
//     newB: {
//       origin: 1
//     }
//   }
// };

// const listSource = {
//   list: [
//     {
//       name: 'item-1',
//       value: [
//         { num: 111 },
//         { num: 112 },
//       ]
//     },
//     {
//       name: 'item-2',
//       value: [
//         { num: 222 },
//         { num: 223 }
//       ]
//     },
//   ],
//   // newList: {}
// }

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
  transform(source, [{ source: 'a', target: 'newA' }]);
  expect('a' in source).toBe(false);
  expect('newA' in source).toBe(true);
  expect(source.newA).toBe('fieldA');
});

test('transform high levels field case', () => {
  transform(source, [
    { source: 'b.c', target: 'newB.newC' },
    { source: 'a', target: 'b.newField' },
    { source: 'b.d.e', target: 'newB.newD.newE' },
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
  const spy = jest.spyOn(global.console, 'error');
  transform(source, [
    { source: 'a', target: 'arr' },
  ]);

  console.log(source);

  expect(spy).toBeCalled();
});
