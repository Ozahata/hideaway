import { TObject } from './contracts';
import { isObject, setWith } from './utils';

/**
 * Run the path and replace any item that finds inside the object.
 * The path must be a string value.
 */
export const generatePath = (
  object: object | undefined | null = undefined,
  path: string[] = [],
) => {
  if (object === undefined || object === null) return path;
  const keys = Object.keys(object);
  return path.map((value) => {
    if (keys.includes(value)) {
      const result = (object as any)[value];
      if (result === null) return value;
      return typeof result === 'string' ? result : JSON.stringify(result);
    }
    return value;
  });
};

export const generateNested = (object: TObject, path: string[], value: any) => {
  let newObject = object;
  if (!isObject(object)) {
    newObject = {}; // override the previous value
  }
  setWith(newObject, path, value);
  return newObject;
};
