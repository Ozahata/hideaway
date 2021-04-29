import { TObject } from './contracts';

/** Used to check objects for own properties. */
const { hasOwnProperty } = Object.prototype;

/**
 * Returns whether or not an object has an own property with the specified name.
 */
export const has = (object: TObject, key: string) => {
  return isObject(object) && hasOwnProperty.call(object, key);
};

/**
 * Returns whether or not a path exists in an object. Only the object's
 * own properties are checked.
 */
export const hasPath = (object: TObject, path: string[]) => {
  let index = -1;
  let { length } = path;
  let result = false;
  let key;

  while (++index < length) {
    key = path[index];
    if (!(result = object != null && hasOwnProperty.call(object, key))) {
      break;
    }
    object = object[key];
  }

  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && (Array.isArray(object) || isObject(object));
};

/**
 * Return true for object and array.
 */
export const isAnyObject = (value: any) =>
  typeof value === 'object' && value !== null;

/**
 * Return true only for the object.
 */
export const isObject = (value: any) =>
  typeof value === 'object' && value !== null && value.constructor === Object;

/**
 * Set a value inside the object based on the path.
 */

export const setWith = (object: any, path: string[], value: any): TObject => {
  if (!isAnyObject(object)) return object;

  const length = path.length;
  const lastIndex = length - 1;

  let index = -1;
  let nested: any = object;
  while (nested !== null && ++index < length) {
    const key = path[index];
    let newValue = value;
    if (index != lastIndex) {
      const objValue = nested[key];
      // @ts-ignore
      newValue = Object(objValue, key, nested);
    }
    nested[key] = newValue;
    nested = nested[key];
  }
  return object;
};

/**
 * If the given non-null object has a value at the given path, it returns the
 * value at that path. Otherwise, it returns the provided default value.
 */
export const pathOr = (object: TObject, path: string[], value: any) => {
  let currObj = object;
  let index = 0;
  let currentPath;
  while (index < path.length) {
    if (currObj == null) {
      break;
    }
    currentPath = path[index];
    currObj = currObj[currentPath];
    index += 1;
  }
  return currObj || value;
};

/**
 * Returns a partial copy of an object omitting the keys specified.
 */
export const omit = (object: TObject, keys: string[]) => {
  const result: TObject = {};
  const index: TObject = {};
  let idx = 0;
  const len = keys.length;

  while (idx < len) {
    index[keys[idx]] = 1;
    idx += 1;
  }

  for (const prop in object) {
    if (!hasOwnProperty.call(index, prop)) {
      result[prop] = object[prop];
    }
  }
  return result;
};

export const deepCopy = (value: any, deep = -1, countDeep = 0): any => {
  if (deep !== -1 && countDeep >= deep) return value;
  if (!isAnyObject(value)) {
    return value;
  }
  const isLimitReached = deep !== -1 && countDeep + 1 <= deep;
  if (Array.isArray(value)) {
    return value.map((v) =>
      isAnyObject(v) && !isLimitReached ? deepCopy(v, deep, countDeep + 1) : v,
    );
  }
  const result: TObject = {};
  for (const [k, v] of Object.entries(value)) {
    result[k] = !isLimitReached ? deepCopy(v, deep, countDeep + 1) : v;
  }
  return result;
};

export const isNull = (value: any) => value === undefined || value === null;
