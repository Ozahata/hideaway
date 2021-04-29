import { createAction, hideaway, hideawayWithOptions } from '../src/index';

// redux-thunk tests can be found here: https://github.com/reduxjs/redux-thunk/tree/master/test

const mockManagerApi = jest.fn();

jest.mock('../src/manager', () => ({
  managerApi: jest
    .fn()
    .mockImplementation((d, g, e, a, error) =>
      mockManagerApi(d, g, e, a, error),
    ),
}));

describe('hideaway middleware', () => {
  const api = () => Promise.resolve();
  beforeEach(() => mockManagerApi.mockReset());

  it('should return a nested value', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const next = jest.fn();
    const nextAction = hideaway({ dispatch, getState })(next);
    const action = createAction('MOCK', { api, isStateManager: true });

    nextAction(action);

    expect(mockManagerApi).toBeCalledTimes(1);
  });

  it('should skip the hideaway middleware for false predicate', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const next = jest.fn();
    const nextAction = hideaway({ dispatch, getState })(next);
    const predicate = jest.fn().mockReturnValue(false);
    const action = createAction('MOCK', { api, predicate });

    nextAction(action);

    expect(predicate).toBeCalledTimes(1);
    expect(predicate).toBeCalledWith(dispatch, getState, undefined, action);
    expect(mockManagerApi).toBeCalledTimes(0);
    expect(next).toBeCalledTimes(0);
  });

  it('should not skip the hideaway middleware for true predicate', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const next = jest.fn();
    const nextAction = hideaway({ dispatch, getState })(next);
    const predicate = jest.fn().mockReturnValue(true);
    const action = createAction('MOCK', { api, predicate });

    nextAction(action);

    expect(predicate).toBeCalledTimes(1);
    expect(predicate).toBeCalledWith(dispatch, getState, undefined, action);
    expect(mockManagerApi).toBeCalledTimes(1);
    expect(next).toBeCalledTimes(0);
  });

  it('should receive the extraArgument from the middleware', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const next = jest.fn();
    const extraArgument = { a: 1 };
    const nextAction = hideawayWithOptions({ extraArgument })({
      dispatch,
      getState,
    })(next);
    const action = createAction('MOCK', { api, isStateManager: true });

    nextAction(action);

    expect(mockManagerApi).toBeCalledWith(
      dispatch,
      getState,
      extraArgument,
      action,
      undefined,
    );
  });

  it('should receive the error from the middleware', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const next = jest.fn();
    const onErrorMiddleware = () => 'middleware';
    const nextAction = hideawayWithOptions({ onError: onErrorMiddleware })({
      dispatch,
      getState,
    })(next);
    const action = createAction('MOCK', { api });

    nextAction(action);

    expect(mockManagerApi).toBeCalledWith(
      dispatch,
      getState,
      undefined,
      action,
      onErrorMiddleware,
    );
  });

  it('should receive the error from the action', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const next = jest.fn();
    const onErrorMiddleware = () => 'middleware';
    const onErrorAction = () => 'action';
    const nextAction = hideawayWithOptions({ onError: onErrorMiddleware })({
      dispatch,
      getState,
    })(next);
    const action = createAction('MOCK', { api, onError: onErrorAction });

    nextAction(action);

    expect(mockManagerApi).toBeCalledWith(
      dispatch,
      getState,
      undefined,
      action,
      onErrorAction,
    );
  });

  it('should send the action', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const next = jest.fn();
    const nextAction = hideaway({ dispatch, getState })(next);
    const action = createAction('MOCK', { isStateManager: true });

    nextAction(action);

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(action);
  });

  it('should skip the action', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const next = jest.fn();
    mockManagerApi.mockReturnValue('api response');
    const nextAction = hideaway({ dispatch, getState })(next);
    const action = createAction('MOCK', { api, isStateManager: true });

    nextAction(action);

    expect(next).toBeCalledTimes(0);
  });
});
