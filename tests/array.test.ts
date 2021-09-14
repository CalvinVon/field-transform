import transform from "../src";

let listSource: { list: { name: string; value: { num: number; }[] }[]; newList?: any[]; obj?: {} },
  list: any[];

beforeEach(() => {
  listSource = {
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
    obj: {}
  };

  list = [
    {
      a: [{ b: 1, oo: 1, ii: 1 }]
    },
    {
      aaa: [{ b: 2 }],
      aa: [{ bb: 1, oo: 2, ii: 2 }]
    },
  ];
});

test('transform whole array value', () => {
  const originList = listSource.list.map((it) => it.name);
  const originNumList = listSource.list.reduce((total: any[], cur) => [...total, cur.value.map(it => it.num)], []);
  transform(listSource, [
    { src: 'list[].name', dest: 'newList[].label' },
    { src: 'list[].value[].num', dest: 'newList[].newValue[].newNum' },
  ]);

  expect('list' in listSource).toBe(true);
  expect('newList' in listSource).toBe(true);
  expect(Array.isArray(listSource.newList)).toBe(true);

  listSource.list.forEach(item => {
    expect('name' in item).toBe(false);

    item.value.forEach(it => {
      expect('num' in it).toBe(false);
    });
  });
  listSource.newList?.forEach((item, index) => {
    expect(Object.keys(item).length).toBe(2);
    expect('label' in item).toBe(true);
    expect(item.label === originList[index]).toBe(true);


    expect('newValue' in item).toBe(true);
    (item.newValue as any[]).forEach((it, idx) => {
      expect('newNum' in it).toBe(true);
      expect(it.newNum === originNumList[index][idx]).toBe(true);
    })
  });
});


test('transform array object gramma', () => {
  const originList = list.reduce((total: any[], cur) => [...total, (cur.a as any[])?.map(it => it.b) ?? []], []);
  transform(list, [
    { src: '[].a[].b', dest: '[].newA[].newB' }
  ]);

  list.forEach((item, index) => {
    expect(Array.isArray(item.a)).toBe(true);
    expect(Array.isArray(item.newA)).toBe(true);

    (item.a as any[]).forEach(it => {
      expect('b' in it).toBe(false);
    });

    (item.newA as any[]).forEach((it, idx) => {
      expect('newB' in it).toBe(true);
      expect(it.newB === originList[index][idx]).toBe(true);
    });
  });
});


test('access fields that not exist would not throw error', () => {
  expect(() => {
    transform(list, [
      { src: '[].not.not', dest: '[].is.is' },
      { src: '[].notArr[].not', dest: '[].isArr[].is' },
    ]);
  }).not.toThrowError();
});


test('transform incorrect array level should warning', () => {
  const spy = jest.spyOn(global.console, 'warn');
  transform(list, [
    { src: '[].a', dest: '[].a[].b' },
  ]);

  expect(spy).toHaveBeenLastCalledWith(new Error('Error found while parsing template gramma: `src` and `dest` should have same array level.'));
});

test('transform dest is not array mode should warning', () => {
  const spy = jest.spyOn(global.console, 'warn');
  transform(listSource, [
    { src: 'list[].name', dest: 'obj[]' },
  ]);

  expect(spy).toHaveBeenLastCalledWith(new TypeError(`Error found while setting fields: incorrect value type of the dest field 'obj'.`));
});
