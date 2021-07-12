import transformer from "../src/field-transform";

const source = {
  prop: 'prop',
  data: {
    a: 'data-a',
    // b: null
    b: {
      c: 'data-C',
      other: 'origin'
    }
  },
  // newData: {
  //   newB: {
  //     origin: 1
  //   }
  // }
};

const listSource = {
  list: [
    {
      name: 'item-1',
      value: [
        { num: 111 },
        { num: 112 },
      ]
    },
    {
      name: 'item-2',
      value: [
        { num: 222 },
        { num: 223 }
      ]
    },
  ],
  newList: {}
}

const list = [
  { a: [{ b: 1, oo: 1, ii: 1 }] },
  { aaa: [{ b: 2 }], aa: [{ bb: 1, oo: 2, ii: 2 }] },
]



transformer(source, [
  // { source: 'data', target: 'newData.newB' },
  // { source: 'data.a', target: 'newData.newA' },
  // { source: 'data.b.c', target: 'newData.newB.hahaha' },
])
transformer(listSource, [
  { source: 'list[].name', target: 'newList[].label' },
  // { source: 'list[].value[].num', target: 'newList[].newValue[].newNum' },
])

transformer(list, [
  // { source: '[].a[].b', target: '[].newA[].newB' }
])