import { getValue, getState } from '../src/selectors';

describe('selector', () => {
  const value = 'mock';
  const stateValue = {
    loading: false,
    value: value,
    error: null,
  };
  const state = {
    a: {
      b: {
        c: value,
        d: stateValue,
      },
    },
  };

  describe('getValue', () => {
    it('shoud return null', () => {
      const result = getValue(state, ['a', 'b', 'c', 'e']);
      expect(result).toBe(null);
    });

    it('shoud return the default value', () => {
      const result = getValue(state, ['a', 'b', 'c', 'e'], value);
      expect(result).toBe(value);
    });

    it('shoud return the value', () => {
      const result = getValue(state, ['a', 'b', 'c'], value);
      expect(result).toBe(value);
    });

    it('shoud return the state manager', () => {
      const result = getValue(state, ['a', 'b', 'd']);
      const expected = { ...stateValue, value };
      expect(result).toStrictEqual(expected);
    });
  });

  describe('getState', () => {
    it('shoud return the state manager structure', () => {
      const newValue = 'kcom';
      const result = getState(state, ['a', 'b', value], newValue);
      expect(result).toStrictEqual({ ...stateValue, value: newValue });
    });

    it('shoud return the value', () => {
      const result = getState(state, ['a', 'b', 'd']);
      expect(result).toStrictEqual(stateValue);
    });
  });
});
