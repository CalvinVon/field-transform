# field transform

一个通过操作对象属性层级的 JS 对象字转换器

[![version](https://img.shields.io/npm/v/field-transform.svg)](https://www.npmjs.com/package/field-transform)
[![codecov](https://codecov.io/gh/CalvinVon/field-transform/branch/master/graph/badge.svg)](https://codecov.io/gh/CalvinVon/field-transform)
[![](https://img.shields.io/npm/dt/field-transform.svg)](https://github.com/CalvinVon/field-transform)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/field-transform)
[![Build Status](https://travis-ci.org/CalvinVon/field-transform.svg?branch=master)](https://travis-ci.org/CalvinVon/field-transform)
[![dependencies](https://img.shields.io/david/CalvinVon/field-transform.svg)](https://www.npmjs.com/package/field-transform)


# 目录

- [快速上手](#快速上手)
  - [安装](#安装)
  - [典型用法](#典型用法)
  - [多层取值](#多层取值)
  - [自动遍历数组](#自动遍历数组)
- [选项](#选项)
  - [delete](#delete-选项)
  - [checkType](#checkType-选项)
  - [strict](#strict-选项)
- [许可证](#许可证)

# 快速上手

## 安装

使用 npm 安装

```bash
npm i field-transform -S
```

或者直接 CDN 方式引入：

```html
<script src="https://cdn.jsdelivr.net/npm/field-transform/dist/field-transform.min.js"></script>
```

---

## 典型用法

```js
import transform from "field-transform";
// 或者 CDN 导入
// var transform = window['fieldTransform'];

const list = {
  total: 1,
  pageNo: 1,
  pageSize: 10,
  pageObject: [
    {
      id: "id",
      name: "name",
    },
  ],
};

// 将 pageObject 的值移至 list 属性上
// list[] 语法表明 list 是个数组，将对列表每一项进行处理
// 将 list 数组下的每一项的 id 值移至对应项上的 value 属性上
// 将 list 数组下的每一项的 name 值移至对应项上的 label 属性上
transform(list, [
  { src: "pageObject", dest: "list" },
  { src: "list[].id", dest: "list[].value" },
  { src: "list[].name", dest: "list[].label" },
]);

// result will be
// {
//   total: 1,
//   pageNo: 1,
//   pageSize: 10,
//   list: [
//     {
//       value: 'id',
//       label: 'name'
//     }
//   ]
// };
```

## 多层取值

**`field-transform` 支持多层级的数据访问存储**

多级路径访问使用 `.` 连接

- 支持 `src` 路径与 `dest` 的路径不同层级的存取（仅适用于对象）
- 支持 `dest` 路径覆盖 `src`

```js
transform(
  {
    outer: {
      inner: {
        value: "calvin",
      },
    },
  },
  [
    {
      src: "outer.inner.value",
      dest: "value",
    },
  ]
);
```

当遇到不存在的路径时，`field-transform` 将会**安全地访问**存取值

- 当**读取**一个不存在路径时，`field-transform` 会自动为每一层创建一个空对象（_但现版本不会自动删除_）
- 当**存储**一个不存在路径时，`field-transform` 会自动为每一层创建一个空对象

```js
transform({ a: 1 }, [
  {
    src: "not.exist.path",
    dest: "value",
  },
  {
    src: "a",
    dest: "real.nested.path",
  },
]);

// {
//   not: { exist: { } },
//   value: undefined,
//   real: { nested: { path: 1 } }
// }
```

## 自动遍历数组

当尝试对数组下的每一项进行操作时，使用 **`xx[]` 语法** 可以便捷地遍历数组

```js
const list = {
  ...
  pageObject: [
    {
      id: 'id',
      name: 'name',
      others: 'xxx'
    }
  ]
};

// 将 pageObject 数组每一项值的 id 和 name 值组成一个新对象并移至名为 list 的新数组的每一项
// pageObject[] 语法表明 list 是个数组，将对列表每一项进行处理
transform(list, [
  { src: 'pageObject[].id', dest: 'list[].value' },
  { src: 'pageObject[].name', dest: 'list[].label' },
]);

// {
//   pageObject: [ { others: 'xxx' } ],
//   list: [ { value: 'id', label: 'name' } ]
// }
```

当传入的直接是数组对象时，所有路径都以 `[].` 开头

```js
transform(
  [
    { id: 'a', name: 'nameA' },
    { id: 'b', name: 'nameB' },
  ],
  [
    { src: "[].id", dest: "[].value" },
    { src: "[].name", dest: "[].label" },
  ]
);

// [
//   { value: 'a', label: 'nameA' },
//   { value: 'b', label: 'nameB' }
// ]
```

---
# 选项

## delete 选项
是否在根据 `src` 路径访问读取完成数据后，删除对应的键值
- type: `boolean`
- default: `true`

## checkType 选项
是否在转移数据时，检查目标（dest）键值和来源（src）键值的类型。若不相同，则将会在控制台输出警告
- type: `boolean`

## strict 选项
是否开启严格模式。开启将 `checkType` 选项置为 `true`，并且默认导出的 `transform` 方法会抛出异常
- type: `boolean`


# 许可证

[MIT 许可证](./LICENSE)
