export type PlainObject = Record<string, any>;
export type TransformMapper = {
  source: string;
  target: string;
};

export type MatchResult = {
  isArray: boolean;
  arrayField: string;
};

export type FieldReaderResult<T> = {
  field: string;
  path: string[];
  data: T;
  parent: any;
};

export type ReadInvolver<T> = {
  enterEachField?: (item: FieldReaderResult<T>, context: ReadInvolverContext) => void;
  leaveEachField?: (item: FieldReaderResult<T>, context: ReadInvolverContext) => void;
}
export type ReadInvolverContext = {
  field: string;
  fieldParseIndex: number;
  isArray: boolean;
  isLastField: boolean;
}