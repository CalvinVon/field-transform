export type PlainObject = Record<string, any>;
export type TransformMapper = {
  src: string;
  dest: string;
};

export type MatchResult = {
  isArray: boolean;
  arrayField: string;
};

export type FieldReaderResult<T = any> = {
  field: string;
  path: string[];
  data: T;
  parent: any;
};

export type ReadInvolver<T = any> = {
  enterEachField?: (item: FieldReaderResult<T>, context: ReadInvolverContext) => void;
  leaveEachField?: (item: FieldReaderResult<T>, context: ReadInvolverContext) => void;
}
export type ReadInvolverContext = {
  field: string;
  fieldParseIndex: number;
  /** current field is parsed from `[]` */
  fieldIsArray: boolean;
  /** parse mode is array */
  isArrayMode: boolean;
  isLastField: boolean;
}

export type TransformConfig = {
  /** Enable strict mode */
  strict?: boolean;
  /** Should check value when setting value */
  checkType?: boolean;
  /**
   * Should the delete original attribute value
   * @default true
   * */
  delete?: boolean;
}