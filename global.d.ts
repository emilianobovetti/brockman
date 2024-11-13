declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module 'xmldom' {
  export class DOMParser {
    constructor(opts: DOMParserOpts);
    parseFromString(source: string, mimeType: string);
  }

  type LogLevel = 'warning' | 'error' | 'fatalError';

  interface DOMParserOpts {
    locator: { lineNumber: number | string; columnNumber: number | string };
    errorHandler(level: LogLevel, message: any);
  }
}

declare module '@fpc/types' {
  export function expectString(val: any): string;
}

declare module '@fpc/result' {
  export type Result<L, R> = {
    isOk: boolean;
    isErr: boolean;
    get(): R;
    getErr(): L;
    map<T, V>(fn: (val: R) => Result<T, V>): Result<T, V>;
    map<T>(fn: (val: R) => T): Result<L, T>;
    mapErr<T>(fn: (err: L) => T): Result<T, R>;
    forEach(fn: (val: R) => void): Result<L, R>;
    forEachErr(fn: (err: L) => void): Result<L, R>;
    merge<T>(valFn: (val: R) => T, errFn: (err: L) => T): T;
    [Symbol.iterator](): Iterator<L | R>;
  };

  export function Result<L, R>(any): Result<L, R>;

  export type Err<L> = Result<L, any>;
  export function Err<L>(err: L): Result<L, any>;

  export type Ok<R> = Result<any, R>;
  export function Ok<R>(val: R): Result<any, R>;
}

declare module '@fpc/stream' {
  type Stream<T> = {
    filter(fn: (val: T) => boolean): Stream<T>;
    forEach(fn: (val: T) => void): Stream<T>;
    map<V>(fn: (val: T) => V): Stream<V>;
    reduce<Acc>(fn: (acc: Acc, val: T) => Acc, init: Acc): Acc;
    slice(begin: number, end: number): Stream<T>;
    consume(): void;
    toArray(): T[];
    [Symbol.iterator](): Iterator<T>;
  };

  export default Stream;

  namespace Stream {
    function fromArrayLike<T>(obj: ArrayLike<T>): Stream<T>;
  }

  export = Stream;
}
