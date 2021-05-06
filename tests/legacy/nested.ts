import { generateNestedLegacy } from '../../src/legacy';
import { IHideawayNestedProps } from '../../src/legacyContracts';

describe('nested -> generateNestedLegacy', () => {
  it('should return the previous state if the nested does not contain the key', () => {
    // If the method is requested, it will replace with an object and override the previous value.
    const expected = 'OK';
    const nested = ({} as unknown) as IHideawayNestedProps;
    const result = generateNestedLegacy(expected, nested, 'Hogue');
    // expect(result).toBe(expected);
    expect(result).toStrictEqual({});
  });

  it('should return the previous state if the nested does not contain the keys', () => {
    // If the method is requested, it will replace with an object and override the previous value.
    const expected = 'OK';
    const nested = ({ path: ['one'] } as unknown) as IHideawayNestedProps;
    const result = generateNestedLegacy(expected, nested, 'Hogue');
    // expect(result).toBe(expected);
    expect(result).toStrictEqual({ one: 'Hogue' });
  });

  it('should return value inside the root key if the nested has a empty path', () => {
    // The new method doesn't add new values if not specified.
    const expected = 'OK';
    const nested = {
      keys: {},
      path: [],
    };
    const result = generateNestedLegacy({}, nested, expected) as { root: any };
    // expect(result.root).toBe(expected);
    expect(result).toStrictEqual({});
  });

  it('should convert all the path with keys', () => {
    const value = 'OK';
    const expected = { 'Mock A': { 'Mock B': value } };
    const nested = {
      keys: { a: 'Mock A', b: 'Mock B' },
      path: ['a', 'b'],
    };
    const result = generateNestedLegacy({}, nested, value);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
  });

  it('should convert all the path with missing key', () => {
    const value = 'OK';
    const expected = { 'Mock A': { 'Mock B': { d: value } } };
    const nested = {
      keys: { a: 'Mock A', b: 'Mock B' },
      path: ['a', 'b', 'd'],
    };
    const result = generateNestedLegacy({}, nested, value);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
  });
});
