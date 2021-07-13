import type { MatchResult, PlainObject, ReadInvolver, FieldReaderResult, TransformMapper } from "./types";

const noop = () => null;

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
function fieldReader<T extends PlainObject | any[]>(data: T, field: string, involver?: ReadInvolver<T>): Array<FieldReaderResult<T>> {
  const {
    enterEachField = noop,
    leaveEachField = noop
  } = involver || {};
  const path = field.split('.');
  let process: FieldReaderResult<T>[] = [{ field, path: [], data, parent: null }];

  path.forEach((f: string, idx: number) => {
    const matchRst = tryMatchArrayGramma(f);
    if (matchRst.isArray) {
      process = process
        .map(it => {
          const field = matchRst.arrayField;
          if (!field && Array.isArray(it.data)) {
            // when root data is `Array` type
            it.data = data || [];
            // it.parent
          }
          else {
            it.path.push(field);
            const isLastField = idx === path.length - 1;
            const ctx = {
              field,
              fieldParseIndex: idx,
              isLastField,
              isArray: matchRst.isArray
            };
            // it.parent = it.data || [];
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
        const isLastField = idx === path.length - 1;
        const ctx = {
          field: f,
          fieldParseIndex: idx,
          isLastField,
          isArray: matchRst.isArray
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

  return process as Array<FieldReaderResult<T>>;
}


/**
 * Field Value Getter
 * 
 * A `fieldReader` wrapper
 */
function fieldGetter<T extends PlainObject | any[]>(data: T, field: string): Array<FieldReaderResult<T>> {
  return fieldReader(data, field, {
    enterEachField(item, { field, isArray }) {
      if (!item.parent) {
        item.parent = isArray ? [] : {};
      }
      if (!item.data) {
        item.parent[field] = isArray ? [] : {};
      }
    },
    leaveEachField({ parent }, { field, isLastField }) {
      if (isLastField) {
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
function fieldSetter<T extends PlainObject | any[]>(data: T, field: string, getterResult: FieldReaderResult<T>[]): Array<FieldReaderResult<T>> {
  return fieldReader(data, field, {
    enterEachField(item, { field, isArray }) {

      // Padding empty value/field
      if (!item.data) {
        if (isArray) {
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
    leaveEachField({ parent, path, data }, { field, isLastField, isArray }) {
      // Checking exist value type
      if (
        isArray && !Array.isArray(data)
        || !isArray && typeof (data) !== 'object'
      ) {
        throw new TypeError(`Error found while setting fields: incorrect value type of the target field '${field}'.`);
      }

      if (isLastField) {
        if (getterResult.length === 1) {
          // normal object replace
          parent[field] = getterResult[0].data;
        }
        else {
          const valueItem = getterResult.find(it => {
            return it.path.every((p, pIdx) => {
              if (p.match(/^\d+$/)) {
                return p === path[pIdx];
              }
              return true;
            })
          });
          parent[field] = valueItem?.data;
        }
      }
    }
  })
}


function transform<T extends PlainObject | any[]>(source: T, mappers: TransformMapper[]): any {
  try {
    mappers.forEach(mapper => {
      const { source: s, target: t } = mapper;
      if (s.match(/\[\]/g)?.length !== t.match(/\[\]/g)?.length) {
        throw new Error('Error found while parsing template gramma: `source` and `target` should have same array level.');
      }

      const getterResult = fieldGetter(source, s);
      fieldSetter(source, t, getterResult);
    });
  } catch (error) {
    console.error(error);
  }
}

export {
  transform,
  fieldReader,
  fieldGetter,
  fieldSetter
}
