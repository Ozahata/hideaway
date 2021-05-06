// @ts-nocheck
import { ReducerManagement, ReducerStateManagement } from '../../src/legacy';
import { testReducer } from './__ignore_tests__/reducer';

describe('reducer -> ReducerManagement -> combine', () => {
  it('should compose with an internal action', () => {
    const initialState = 'Initial state';
    const expected = 'Action result';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: false,
      reducers: { MOCK: (_state, { payload }) => payload },
    });
    const result = manager.combine()(undefined, {
      type: 'MOCK',
      payload: expected,
    });
    expect(result).toBe(expected);
  });

  it('should compose with an external action', () => {
    const initialState = 'Initial state';
    const expected = 'Action result';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: false,
    });
    const result = manager.combine({
      SIMPLE_ACTION: testReducer,
    })(undefined, {
      type: 'SIMPLE_ACTION',
      text: expected,
    });
    expect(result).toBe(expected);
  });

  it('should compose with an initialization action', () => {
    const initialState = 'Initial state';
    const expected = 'Action result';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: false,
      reducers: {
        SIMPLE_ACTION: testReducer,
      },
    });
    const result = manager.combine()(undefined, {
      type: 'SIMPLE_ACTION',
      text: expected,
    });
    expect(result).toBe(expected);
  });

  it('should compose with an initialization action with state manager', () => {
    const initialState = 'Initial state';
    const message = 'Action result';
    // To return null, the initialState must be null
    // const expected = {
    //   loading: false,
    //   value: null,
    //   error: message,
    // };
    const expected = {
      loading: false,
      value: {},
      error: message,
    };
    const manager = new ReducerManagement({
      initialState,
      isStateManager: true,
      reducers: {
        SIMPLE_ACTION: testReducer,
      },
    });
    const result = manager.combine()(
      {},
      {
        type: 'SIMPLE_ACTION_ERROR',
        payload: message,
      },
    );
    expect(result).toStrictEqual(expected);
  });
});

describe('reducer -> Managers', () => {
  it('should not use state manage as default', () => {
    const reducerManager = new ReducerManagement();
    expect(reducerManager.isStateManager).toBeFalsy();
  });

  it('should use state manage as default', () => {
    const reducerManager = new ReducerStateManagement();
    expect(reducerManager.isStateManager).toBeTruthy();
  });
});
