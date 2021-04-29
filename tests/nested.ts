import { generatePath } from '../src/nested';

describe('nested -> generatePath', () => {
  const path = ['a', 'b', 'c', '2'];

  [undefined, null, {}, []].forEach((item) => {
    it(`shoud return the original path for ${JSON.stringify(
      item,
    )} object`, () => {
      const result = generatePath(item, path);
      expect(result).toStrictEqual(path);
    });
  });

  it(`shoud return the original`, () => {
    const state = { a: 1 };
    const result = generatePath(state);
    expect(result).toStrictEqual([]);
  });

  it('it should return the original path for an object without matched keys', () => {
    const obj = { d: 2 };
    const result = generatePath(obj, path);
    expect(result).toStrictEqual(path);
  });

  it('it should return the original path for a key with null value', () => {
    const obj = { b: null };
    const result = generatePath(obj, path);
    expect(result).toStrictEqual(path);
  });

  it('shoud replace the value for a string', () => {
    const obj = { b: '2' };
    const result = generatePath(obj, path);
    expect(result).toStrictEqual(['a', '2', 'c', '2']);
  });

  it('shoud replace the value for an integer', () => {
    const obj = { b: 2 };
    const result = generatePath(obj, path);
    expect(result).toStrictEqual(['a', '2', 'c', '2']);
  });

  it('shoud return replace the value for decimal', () => {
    const obj = { b: 0.1 };
    const result = generatePath(obj, path);
    expect(result).toStrictEqual(['a', '0.1', 'c', '2']);
  });

  it('shoud return replace the value for object', () => {
    const obj = { b: { d: 2 } };
    const result = generatePath(obj, path);
    expect(result).toStrictEqual(['a', '{"d":2}', 'c', '2']);
  });

  it('shoud return replace the value for array', () => {
    const obj = { b: ['d'] };
    const result = generatePath(obj, path);
    expect(result).toStrictEqual(['a', '["d"]', 'c', '2']);
  });
});
