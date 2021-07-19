import { createReducer } from '../src/reducer';
import { HideawayAction, Reducers } from '../src/contracts';
import { createAction } from '../src/action';
import { createStateManager } from '../src/manager';

describe('reducer', () => {
  let state: any;
  let action: HideawayAction;
  let initialState: any;
  let nestedInitialState: any;
  const payload = 'mock';

  const reducers: Reducers = {
    UNKNOWN: () => null,
    SET_VALUE: (_, { payload }) => {
      return payload;
    },
  };

  beforeEach(() => {
    state = null;
    action = { type: 'MOCK' };
    initialState = 'a';
    nestedInitialState = null;
  });

  describe('Initial state', () => {
    it('should return mull for undefined state and undefined initial state', () => {
      state = undefined;
      const manager = createReducer();
      expect(manager.combine({})(state, action)).toBeNull();
    });

    it('should return null for undefined initial state', () => {
      state = null;
      const manager = createReducer();
      expect(manager.combine({})(state, action)).toBe(null);
    });

    it('should return the initial state for undefined state', () => {
      state = undefined;
      const manager = createReducer(initialState);
      expect(manager.combine({})(state, action)).toBe(initialState);
    });

    it('should return the initial state for null state', () => {
      state = null;
      const manager = createReducer(initialState);
      expect(manager.combine({})(state, action)).toBe(initialState);
    });
  });

  describe('Nested', () => {
    it('should override the state', () => {
      state = 123;
      action = createAction('SET_VALUE', { payload, path: ['a', 'b', 'c'] });
      const expected = { a: { b: { c: payload } } };
      const manager = createReducer();
      expect(manager.combine(reducers)(state, action)).toStrictEqual(expected);
    });

    it('should return a nested path', () => {
      action = createAction('SET_VALUE', { payload, path: ['a', 'b', 'c'] });
      const expected = { a: { b: { c: payload } } };
      const manager = createReducer();
      expect(manager.combine(reducers)(state, action)).toStrictEqual(expected);
    });

    it('should merge the nested path', () => {
      state = { a: { b: { d: payload } } };
      action = createAction('SET_VALUE', { payload, path: ['a', 'b', 'c'] });
      const expected = { a: { b: { c: payload, d: payload } } };
      const manager = createReducer();
      expect(manager.combine(reducers)(state, action)).toStrictEqual(expected);
    });

    it('should return dynamic path', () => {
      state = { a: { b: { d: payload } } };
      action = createAction('SET_VALUE', {
        payload,
        path: ['a', 'b', 'c'],
        keys: { a: 'e', b: 'f', c: 'g' },
      });
      const expected = { ...state, e: { f: { g: payload } } };
      const manager = createReducer();
      expect(manager.combine(reducers)(state, action)).toStrictEqual(expected);
    });

    it('should call the valuePreStore method', () => {
      const valuePreStore = jest.fn(() => initialState);
      action = createAction('SET_VALUE_RESPONSE', {
        path: ['a'],
        valuePreStore,
      });
      const manager = createReducer();
      expect(manager.combine(reducers)(state, action)).toBe(initialState);
      expect(valuePreStore).toBeCalledTimes(1);
    });

    it('should return the nestedInitialState', () => {
      action = createAction('SET_VALUE', { path: ['a', 'b', 'c'] });
      nestedInitialState = initialState;
      const expected = { a: { b: { c: initialState } } };
      const manager = createReducer(null, { nestedInitialState });
      expect(
        manager.combine({ SET_VALUE: (s) => s })(state, action),
      ).toStrictEqual(expected);
    });
  });

  describe('State Manager', () => {
    const isStateManager = true;

    it('should generate the state manager', () => {
      const value = createStateManager(null);
      expect(createStateManager(value)).toStrictEqual(value);
    });

    it('should return the initial state', () => {
      const expected = createStateManager(initialState);
      const manager = createReducer(initialState, { isStateManager });
      expect(manager.combine({})(state, action)).toStrictEqual(expected);
    });

    it('should return loading as true', () => {
      action = createAction('SET_VALUE_REQUEST', { isStateManager });
      const manager = createReducer(null, { isStateManager });
      const result = manager.combine(reducers)(state, action);
      expect(result.loading).toBeTruthy();
      expect(result.value).toBeNull();
      expect(result.error).toBeNull();
    });

    it('should not change the value', () => {
      action = createAction('SET_VALUE_REQUEST', { isStateManager });
      state = createStateManager(payload);
      const manager = createReducer({}, { isStateManager });
      const result = manager.combine(reducers)(state, action);
      expect(result).toStrictEqual({ ...state, loading: true });
    });

    it('should return the value', () => {
      action = createAction('SET_VALUE_RESPONSE', {
        isStateManager,
        payload,
      });
      const manager = createReducer(null, { isStateManager });
      const result = manager.combine(reducers)(state, action);
      expect(result.loading).toBeFalsy();
      expect(result.value).toBe(payload);
      expect(result.error).toBeNull();
    });

    it('should return the error', () => {
      action = createAction('SET_VALUE_ERROR', { payload });
      const manager = createReducer(null, { isStateManager });
      const result = manager.combine(reducers)(state, action);
      expect(result.loading).toBeFalsy();
      expect(result.value).toBeNull();
      expect(result.error).toBe(payload);
    });

    it('should call the valuePreStore method', () => {
      const valuePreStore = jest.fn(() => initialState);
      action = createAction('SET_VALUE_RESPONSE', {
        payload,
        isStateManager,
        valuePreStore,
      });
      state = createStateManager(null);
      const manager = createReducer(null, { isStateManager });
      expect(manager.combine(reducers)(state, action)).toBe(initialState);
      expect(valuePreStore).toBeCalledTimes(1);
    });
  });

  describe('Nested and State Manager', () => {
    const isStateManager = true;
    const nestAndState = {
      isStateManager,
      nestedInitialState: null,
    };

    it('should override the state manager', () => {
      state = createStateManager(null);
      action = createAction('SET_VALUE_RESPONSE', {
        payload,
        isStateManager,
        path: ['a'],
      });
      const manager = createReducer(null, nestAndState);
      const expected = { a: createStateManager(payload) };
      expect(manager.combine(reducers)(state, action)).toStrictEqual(expected);
    });

    it('should the path with state', () => {
      action = createAction('SET_VALUE_RESPONSE', {
        payload,
        isStateManager,
        path: ['a'],
      });
      const manager = createReducer(null, nestAndState);
      const expected = { a: createStateManager(payload) };
      expect(manager.combine(reducers)(state, action)).toStrictEqual(expected);
    });

    it('should replace the value', () => {
      action = createAction('SET_VALUE_RESPONSE', {
        payload,
        isStateManager,
        path: ['a'],
      });
      state = { a: createStateManager(null) };
      const manager = createReducer(null, nestAndState);
      const expected = { a: createStateManager(payload) };
      expect(manager.combine(reducers)(state, action)).toStrictEqual(expected);
    });

    it('should call the valuePreStore method', () => {
      const valuePreStore = jest.fn(() => initialState);
      action = createAction('SET_VALUE_RESPONSE', {
        payload,
        isStateManager,
        path: ['a'],
        valuePreStore,
      });
      state = { a: createStateManager(initialState) };
      const manager = createReducer({}, nestAndState);
      expect(manager.combine(reducers)(state, action)).toBe(initialState);
      expect(valuePreStore).toBeCalledTimes(1);
    });

    describe('nestedInitialState variation', () => {
      it('should return the initial value', () => {
        const manager = createReducer(initialState, nestAndState);
        expect(manager.combine({})(state, action)).toStrictEqual(initialState);
      });

      it('should update the loading inside the path', () => {
        action = createAction('SET_VALUE_REQUEST', {
          payload,
          path: ['a', 'b', 'c'],
          isStateManager,
        });
        const value = { ...createStateManager(null), loading: true };
        const expected = { a: { b: { c: value } } };
        const manager = createReducer(null, nestAndState);
        const setValue = (s: any, a: any) => [...s, a.payload];
        expect(
          manager.combine({ SET_VALUE: setValue })(state, action),
        ).toStrictEqual(expected);
      });

      it('should update the value', () => {
        action = createAction('SET_VALUE_RESPONSE', {
          payload,
          path: ['a', 'b', 'c'],
          isStateManager,
        });
        const value = { ...createStateManager(payload) };
        const expected = { a: { b: { c: value } } };
        const manager = createReducer(null, nestAndState);
        const setValue = (_: any, a: any) => a.payload;
        expect(
          manager.combine({ SET_VALUE: setValue })(state, action),
        ).toStrictEqual(expected);
      });

      it('should update the nested', () => {
        state = { a: { b: { d: 'a' } } };
        action = createAction('SET_VALUE_RESPONSE', {
          payload,
          path: ['a', 'b', 'c'],
          isStateManager,
        });
        const value = { ...createStateManager(payload) };
        const expected = { a: { b: { c: value, d: 'a' } } };
        const manager = createReducer('INITIAL', nestAndState);
        const setValue = (_: any, a: any) => a.payload;
        expect(
          manager.combine({ SET_VALUE: setValue })(state, action),
        ).toStrictEqual(expected);
      });

      it('should ignore nested and state manager', () => {
        state = { a: { b: { d: 1 } } };
        action = createAction('CLEAR_RESPONSE', { valuePreStore: () => ({}) });
        const expected = {};
        const manager = createReducer('INITIAL', nestAndState);
        expect(
          manager.combine({ CLEAR: () => 'valuePreStore' })(state, action),
        ).toStrictEqual(expected);
      });
    });
  });
});
