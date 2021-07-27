import { TObject } from '../src';
import {
  deepCopy,
  has,
  hasPath,
  isAnyObject,
  isNull,
  isObject,
  omit,
  pathOr,
  setWith,
} from '../src/utils';

describe('object -> setWith', () => {
  it('should not set the value', () => {
    const obj = {};
    const path: string[] = [];
    const value = 'a';
    expect(setWith(obj, path, value)).toStrictEqual(obj);
  });

  it('should add the value to the path', () => {
    const obj = { f: 1 };
    const path = ['a', 'b', 'c'];
    const value = 'd';
    const expected = { a: { b: { c: 'd' } }, f: 1 };
    expect(setWith(obj, path, value)).toStrictEqual(expected);
  });

  it('should merge the values', () => {
    const obj = { a: { b: { f: 1 } } };
    const path = ['a', 'b', 'c'];
    const value = 'd';
    const expected = { a: { b: { f: 1, c: 'd' } } };
    expect(setWith(obj, path, value)).toStrictEqual(expected);
  });

  it('should return the same value', () => {
    const obj = 1;
    expect(setWith(obj, [], {})).toStrictEqual(obj);
  });

  it('should return the same value', () => {
    const obj = { a: 1 };
    const expected = { a: 1, b: { c: undefined } };
    expect(setWith(obj, ['b', 'c'], undefined)).toStrictEqual(expected);
  });
});

describe('utils -> isObject', () => {
  it('should return false for number', () => {
    expect(isObject(1)).toBeFalsy();
  });

  it('should return false for string', () => {
    expect(isObject('1')).toBeFalsy();
  });

  it('should return false for array', () => {
    expect(isObject(['1'])).toBeFalsy();
  });

  it('should return false for empty array', () => {
    expect(isObject([])).toBeFalsy();
  });

  it('should return false for null', () => {
    expect(isObject(null)).toBeFalsy();
  });

  it('should return false for undefined', () => {
    expect(isObject(undefined)).toBeFalsy();
  });

  it('should return false for function', () => {
    expect(isObject(() => {})).toBeFalsy();
  });

  it('should return true for empty object', () => {
    expect(isObject({})).toBeTruthy();
  });

  it('should return true for object', () => {
    expect(isObject({ '1': 1 })).toBeTruthy();
  });
});

describe('utils -> isAnyObject', () => {
  it('should return false for number', () => {
    expect(isAnyObject(1)).toBeFalsy();
  });

  it('should return false for string', () => {
    expect(isAnyObject('1')).toBeFalsy();
  });

  it('should return false for array', () => {
    expect(isAnyObject(['1'])).toBeTruthy();
  });

  it('should return false for empty array', () => {
    expect(isAnyObject([])).toBeTruthy();
  });

  it('should return false for null', () => {
    expect(isAnyObject(null)).toBeFalsy();
  });

  it('should return false for undefined', () => {
    expect(isAnyObject(undefined)).toBeFalsy();
  });

  it('should return true for empty object', () => {
    expect(isAnyObject({})).toBeTruthy();
  });

  it('should return true for object', () => {
    expect(isAnyObject({ '1': 1 })).toBeTruthy();
  });

  it('should return false for function', () => {
    expect(isObject(() => {})).toBeFalsy();
  });
});

describe('utils -> has', () => {
  it('should return false if not find the key', () => {
    expect(has({}, 'a')).toBeFalsy();
  });

  it('should return true if not find the key', () => {
    expect(has({ a: 1 }, 'a')).toBeTruthy();
  });
});

describe('utils -> hasPath', () => {
  const obj = { a: { b: { c: 3 } }, d: null, e: [] };

  it('should return false if not find the path', () => {
    expect(hasPath(obj, ['d', 'f'])).toBeFalsy();
    expect(hasPath(obj, ['e', 'f'])).toBeFalsy();
    expect(hasPath(obj, ['b'])).toBeFalsy();
    expect(hasPath(obj, [])).toBeFalsy();
    expect(hasPath(null as unknown as TObject, ['a'])).toBeFalsy();
    expect(hasPath([] as unknown as TObject, ['a'])).toBeFalsy();
    expect(hasPath({} as TObject, ['a'])).toBeFalsy();
  });

  it('should return true for existing path', () => {
    expect(hasPath(obj, ['a', 'b', 'c'])).toBeTruthy();
    expect(hasPath(obj, ['a', 'b'])).toBeTruthy();
    expect(hasPath(obj, ['a'])).toBeTruthy();
    expect(hasPath(obj, ['d'])).toBeTruthy();
    expect(hasPath(obj, ['e'])).toBeTruthy();
  });
});

describe('utils -> pathOr', () => {
  it('should return the original object', () => {
    expect(pathOr({}, [], 'a')).toStrictEqual({});
  });

  it('should return the default value', () => {
    expect(pathOr({}, ['b'], 'a')).toStrictEqual('a');
  });

  it('should return the value', () => {
    expect(pathOr({ b: 'c' }, ['b'], 'a')).toStrictEqual('c');
  });
});

describe('utils -> omit', () => {
  const object: TObject = {
    a: 1,
    b: 2,
    c: 3,
  };

  it('should omit from the object', () => {
    expect(omit(object, ['a'])).toStrictEqual({ b: 2, c: 3 });
  });
});

describe('utils -> deepCopy', () => {
  it('should return null', () => {
    const obj = null;
    expect(deepCopy(obj) === obj).toBeTruthy();
  });

  it('should return number', () => {
    const obj = 1;
    expect(deepCopy(obj) === obj).toBeTruthy();
  });

  it('should return string', () => {
    const obj = 'a';
    expect(deepCopy(obj) === obj).toBeTruthy();
  });

  it('should return a different object', () => {
    const obj = {};
    expect(deepCopy(obj) === obj).toBeFalsy();
  });

  it('should return a different object for nested object', () => {
    const array = [{ f: 'f' }, 2, '3', []];
    const obj = { a: 1, b: 'b', c: array, d: { g: {} } };
    const result = deepCopy(obj);
    expect(result === obj).toBeFalsy();
    expect(result['a'] === obj['a']).toBeTruthy();
    expect(result['b'] === obj['b']).toBeTruthy();
    expect(result['c'] === obj['c']).toBeFalsy();
    expect(result['c'][0] === obj['c'][0]).toBeFalsy();
  });

  it('should return a new empty array', () => {
    const array: any[] = [];
    const result = deepCopy(array);
    expect(result === array).toBeFalsy();
  });

  it('should return an array with integer', () => {
    const array = ['a', 'b'];
    const result = deepCopy(array);
    expect(result === array).toBeFalsy();
  });

  it('should return an array with number', () => {
    const array = ['a', 1];
    const result = deepCopy(array);
    expect(result === array).toBeFalsy();
  });

  it('should return an array with array', () => {
    const array = [['a']];
    const result = deepCopy(array);
    expect(result === array).toBeFalsy();
    expect(result[0] === array[0]).toBeFalsy();
  });

  it('should return an array with object', () => {
    const array = [{ a: 1 }];
    const result = deepCopy(array);
    expect(result === array).toBeFalsy();
    expect(result[0] === array[0]).toBeFalsy();
  });

  it('should return an array with nested object', () => {
    const array = [{ a: 1, b: ['c', 'd'], e: { f: 2, g: 3 } }];
    const result = deepCopy(array);
    expect(result === array).toBeFalsy();
    expect(result[0]['b'] === array[0]['b']).toBeFalsy();
    expect(result[0]['e'] === array[0]['e']).toBeFalsy();
  });

  it('should return limit the depth 0', () => {
    const array = [{ a: 1, b: ['c', 'd'], e: { f: 2, g: 3 } }];
    const result = deepCopy(array, 0);
    expect(result === array).toBeTruthy();
    expect(result[0]['b'] === array[0]['b']).toBeTruthy();
    expect(result[0]['e'] === array[0]['e']).toBeTruthy();
  });

  it('should return limit the depth 1', () => {
    const array = [{ a: 1, b: ['c', 'd'], e: { f: 2, g: 3 } }];
    const result = deepCopy(array, 1);
    expect(result === array).toBeFalsy();
    expect(result[0]['b'] === array[0]['b']).toBeTruthy();
    expect(result[0]['e'] === array[0]['e']).toBeTruthy();
  });
});

describe('utils -> isNull', () => {
  it('should return true for null', () => {
    expect(isNull(null)).toBeTruthy();
  });

  it('should return true for undefined', () => {
    expect(isNull(undefined)).toBeTruthy();
  });

  it('should return false for empty string', () => {
    expect(isNull('')).toBeFalsy();
  });

  it('should return false for number', () => {
    expect(isNull(0)).toBeFalsy();
  });

  it('should return false for empty object', () => {
    expect(isNull({})).toBeFalsy();
  });

  it('should return false for empty array', () => {
    expect(isNull([])).toBeFalsy();
  });
});
