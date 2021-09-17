import type { MatchResult, PlainObject, ReadInvolver, FieldReaderResult, TransformMapper, TransformConfig } from "./types";

const noop = () => null;
const defaultConfig: TransformConfig = {
  strict: false,
  checkType: false,
  delete: true
};

function tryMatchArrayGramma(field: string): MatchResult {
  const result: MatchResult = {
    isArray: false,
    arrayField: ''
  };
  let arrayMatches;
  if (arrayMatches = field.match(/^(\S*)\[\]$/)) {
    result.isArray = true;
    result.arrayField = arrayMatches[1];
  }

  return result;
}



/**
 * Read values from specific fields of data, parse given fields path gramma
 * @param {T} data
 * @param {string} field
 * @param {ReadInvolver} involver
 * @param involver.enterEachField whether delete field key after read. Default `true`
 * @param involver.leaveEachField whether delete field key after read. Default `true`
*/
function fieldReader<T extends PlainObject | PlainObject[]>(data: T, field: string, involver?: ReadInvolver): Array<FieldReaderResult> {
  const {
    enterEachField = noop,
    leaveEachField = noop
  } = involver || {};

  const paths = field.split('.');
  const isArrayMode = paths.some(path => tryMatchArrayGramma(path).isArray);
  let process: FieldReaderResult[] = [{ field, path: [], data, parent: null }];

  paths.forEach((f: string, idx: number) => {
    const matchRst = tryMatchArrayGramma(f);
    if (matchRst.isArray) {
      process = process
        .map(it => {
          const field = matchRst.arrayField;
          if (!field && Array.isArray(it.data)) {
            // when root data is `Array` type
            it.data = data || [];
          }
          else {
            it.path.push(field);
            const isLastField = idx === paths.length - 1;
            const ctx = {
              field,
              fieldParseIndex: idx,
              isLastField,
              fieldIsArray: matchRst.isArray,
              isArrayMode
            };
            it.parent = it.data;
            it.data = it.parent[field];
            const params = [it, ctx] as const;

            enterEachField(...params);
            it.data = it.parent[field];
            leaveEachField(...params);
          }

          return it;
        })
        .reduce((total, it) => {
          total.push(...it.data!.map((d: any, idx: number) => ({ path: [...it.path, idx + ''], data: d, field } as FieldReaderResult<T>)));
          return total;
        }, [] as typeof process);

    }
    else {
      process = process.map(it => {
        it.path.push(f);
        const isLastField = idx === paths.length - 1;
        const ctx = {
          field: f,
          fieldParseIndex: idx,
          isLastField,
          fieldIsArray: matchRst.isArray,
          isArrayMode
        };

        it.parent = it.data;
        it.data = it.parent[f];
        const params = [it, ctx] as const;

        enterEachField(...params);
        it.data = it.parent[f];
        leaveEachField(...params);
        return it;
      });
    }

  });

  return process as Array<FieldReaderResult>;
}


/**
 * Field Value Getter
 * 
 * A `fieldReader` wrapper
 */
function fieldGetter<T extends PlainObject | PlainObject[]>(data: T, field: string, config?: TransformConfig): Array<FieldReaderResult> {
  const { delete: deleteKey } = { ...defaultConfig, ...config };
  return fieldReader(data, field, {
    enterEachField(item, { field, fieldIsArray, isLastField }) {
      if (!item.data) {
        if (isLastField) {
          item.parent[field] = undefined;
        }
        else {
          item.parent[field] = fieldIsArray ? [] : {};
        }
      }
    },
    leaveEachField({ parent }, { field, isLastField }) {
      if (deleteKey && isLastField) {
        delete parent[field];
      }
    }
  })
}


/**
 * Field Value Setter
 * 
 * A `fieldReader` wrapper
 */
function fieldSetter<T extends PlainObject | PlainObject[]>(data: T, field: string, getterResult: FieldReaderResult[], config?: TransformConfig): Array<FieldReaderResult> {
  let {
    checkType,
    strict
  } = { ...defaultConfig, ...config };

  if (strict) {
    checkType = true;
  }

  /** Check exist value type */
  const checkExistValueType = (source: any, target: any) => {
    if (checkType) {
      const getType = Object.prototype.toString;
      const sType = getType.call(source);
      const tType = getType.call(target);

      if (sType !== tType && tType !== '[object Undefined]') {
        throw new TypeError(
          `Error found while setting fields: incorrect value type of the dest field '${field}'. Expecting type is ${sType}, actual type is ${tType}`
        );
      }
    }
  };

  return fieldReader(data, field, {
    enterEachField(item, { field, fieldIsArray, isLastField }) {

      // Padding empty value/field
      if (!item.data) {
        if (isLastField) {
          item.parent[field] = undefined;
          return;
        }
        if (fieldIsArray) {
          item.parent[field] = getterResult
            .map((_, index) => {
              const foundItem = getterResult.find(it => +it.path[item.path.length] === index);
              return foundItem ? {} : null;
            })
            .filter(Boolean)
        }
        else {
          item.parent[field] = {};
        }
      }
    },
    leaveEachField({ parent, path, data }, { field, isLastField, fieldIsArray, isArrayMode }) {
      // Checking exist value type
      if (
        fieldIsArray && !Array.isArray(data)
        || !fieldIsArray && (!isLastField && (typeof (data) !== 'object'))
      ) {
        throw new TypeError(`Error found while setting fields: incorrect value type of the dest field '${field}'.`);
      }

      if (isLastField) {
        let valueItem;
        if (!isArrayMode) {
          valueItem = getterResult[0];
        }
        else {
          valueItem = getterResult.find(it => {
            return it.path.every((p, pIdx) => {
              if (p.match(/^\d+$/)) {
                return p === path[pIdx];
              }
              return true;
            })
          });
        }

        const source = valueItem?.data;
        const target = parent[field];
        checkExistValueType(source, target);
        parent[field] = source;
      }
    }
  })
}


function transform<T extends PlainObject | any[]>(source: T, mappers: TransformMapper[], config?: TransformConfig) {
  const { strict } = { ...defaultConfig, ...config };
  try {
    mappers.forEach(mapper => {
      const { src: s, dest: t } = mapper;
      if (s.match(/\[\]/g)?.length !== t.match(/\[\]/g)?.length) {
        throw new Error('Error found while parsing template gramma: `src` and `dest` should have same array level.');
      }

      const getterResult = fieldGetter(source, s, config);
      fieldSetter(source, t, getterResult, config);
    });

    return source as T extends any[] ? any[] : PlainObject;
  } catch (error) {
    if (strict) {
      throw error;
    }
    console.warn(error);
  }
}

export {
  transform,
  fieldReader,
  fieldGetter,
  fieldSetter
}
