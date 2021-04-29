import { ACTION_OPTIONS, createAction } from '../src/action';
import { HIDEAWAY } from '../src/constants';

describe('action', () => {
  const type = 'ACTION';

  it('should return the type', () => {
    const result = createAction(type);
    expect(result.type).toBe(type);
  });

  it('should return payload', () => {
    const expected = { type, payload: {} };
    const result = createAction(type, expected);
    expect(result).toStrictEqual(expected);
  });

  it('should have hideaway parameters ', () => {
    const args = {
      api: jest.fn(),
      isStateManager: true,
      path: [],
      keys: {},
      apiPreReducer: jest.fn(),
      predicate: () => true,
      onError: () => true,
      valuePreStore: jest.fn(),
      dispatchTypeOnError: 'ERROR',
    };
    const result = createAction(type, args);
    const keys = Object.keys(result[HIDEAWAY]);
    const expected = ACTION_OPTIONS;
    expect(keys.sort()).toStrictEqual(expected.sort());
  });
});
