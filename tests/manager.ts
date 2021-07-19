import { HIDEAWAY, HideawayDispatch, TObject } from '../src';
import { createAction } from '../src/action';
import {
  createStateManager,
  isStateManagerFn,
  managerApi,
  getUndefinedStateErrorMessage,
} from '../src/manager';
import { Api, HideawayAction } from '../src/contracts';

describe('managerApi', () => {
  const type = 'MOCK';
  const payload = 'mock';
  let onError = jest.fn();
  let getState: any;
  let actionDispatch: TObject[];
  let extraArgument: TObject;
  let api: Api;
  const contentApi = 'api response';

  const createApi =
    ({ ok = true, headers }: TObject = {}, content = contentApi) =>
    () => {
      return Promise.resolve({
        ok,
        headers: headers || { get: jest.fn() },
        json: () => JSON.parse(content),
        text: () => content,
      });
    };

  const dispatch = ((action: HideawayAction) =>
    actionDispatch.push(action)) as HideawayDispatch;

  beforeEach(() => {
    getState = () => {};
    actionDispatch = [];
    extraArgument = {};
    api = createApi();
    onError.mockClear();
  });

  describe('Function', () => {
    describe('isStateManager', () => {
      it('should return false', () => {
        const result = isStateManagerFn(payload);
        expect(result).toBeFalsy();
      });

      it('should return true', () => {
        const state = createStateManager(payload);
        const result = isStateManagerFn(state);
        expect(result).toBeTruthy();
      });
    });

    describe('getUndefinedStateErrorMessage', () => {
      it('should generate a message with action type', () => {
        const key = 'mock';
        const action = { type: 'MOCK' };
        const expected =
          `Given action "MOCK", reducer "mock" returned undefined. ` +
          `To ignore an action, you must explicitly return the previous state. ` +
          `If you want this reducer to hold no value, you can return null instead of undefined.`;
        const message = getUndefinedStateErrorMessage(key, action);
        expect(message).toBe(expected);
      });

      it('should generate a message without action type', () => {
        const key = 'mock';
        const action = {} as unknown as HideawayAction;
        const expected =
          `Given an action, reducer "mock" returned undefined. ` +
          `To ignore an action, you must explicitly return the previous state. ` +
          `If you want this reducer to hold no value, you can return null instead of undefined.`;
        const message = getUndefinedStateErrorMessage(key, action);
        expect(message).toBe(expected);
      });
    });
  });

  describe('State manager', () => {
    const isStateManager = true;

    it('should dispatch the action request', async () => {
      const action = createAction(type, { api, isStateManager });
      const expected = {
        type: `${type}_REQUEST`,
        [HIDEAWAY]: { isStateManager },
      };
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(actionDispatch[0]).toStrictEqual(expected);
    });

    it('should dispatch the action response', async () => {
      const action = createAction(type, { api, isStateManager });
      const expected = {
        type: `${type}_RESPONSE`,
        payload: contentApi,
        [HIDEAWAY]: { isStateManager },
      };
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(actionDispatch[1]).toStrictEqual(expected);
    });

    it('should return a JSON format', async () => {
      api = createApi(
        {
          ok: true,
          headers: {
            get: jest
              .fn()
              .mockReturnValue('content-type: application/json; charset=UTF-8'),
          },
        },
        '{"a": 1}',
      );
      const action = createAction(type, { api, isStateManager });
      const expected = {
        type: `${type}_RESPONSE`,
        payload: { a: 1 },
        [HIDEAWAY]: { isStateManager },
      };
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(actionDispatch[1]).toStrictEqual(expected);
    });

    it('should dispatch the action error', async () => {
      api = createApi({ ok: false });
      const action = createAction(type, { api, isStateManager });
      await managerApi(dispatch, getState, extraArgument, action, undefined);
      expect(actionDispatch[1].type).toBe(`${type}_ERROR`);
    });

    it('should call the api function', async () => {
      api = jest.fn().mockReturnValue(createApi()());
      const action = createAction(type, { api, isStateManager });
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(api).toBeCalledTimes(1);
      expect(api).toBeCalledWith(dispatch, getState, extraArgument, action);
    });

    it('should call the onError function', async () => {
      api = createApi({ ok: false });
      const action = createAction(type, { api, isStateManager });
      onError = jest.fn();
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(onError).toBeCalledTimes(1);
      expect(onError.mock.calls[0].length).toBe(5);
    });

    it('should call the apiPreReducer function', async () => {
      const message = 'pre';
      const apiPreReducer = jest.fn().mockReturnValue(message);
      const action = createAction(type, { api, isStateManager, apiPreReducer });
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(actionDispatch[1].type).toBe(`${type}_RESPONSE`);
      expect(actionDispatch[1].payload).toBe(message);
      expect(apiPreReducer).toBeCalledTimes(1);
      expect(apiPreReducer).toBeCalledWith(
        contentApi,
        dispatch,
        getState,
        extraArgument,
        action,
      );
    });
  });

  describe('Normal', () => {
    const isStateManager = false;

    it('should ignore the action', async () => {
      const action = createAction(type, { isStateManager });
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(actionDispatch.length).toBe(0);
    });

    it('should return the payload', async () => {
      const action = createAction(type, { api, isStateManager });
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(actionDispatch[0].payload).toStrictEqual(contentApi);
    });

    it('should return the JSON format', async () => {
      api = createApi(
        {
          ok: true,
          headers: {
            get: jest
              .fn()
              .mockReturnValue('content-type: application/json; charset=UTF-8'),
          },
        },
        '{"a": 1}',
      );
      const expected = { a: 1 };
      const action = createAction(type, { api, isStateManager });
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(actionDispatch[0].type).toBe(type);
      expect(actionDispatch[0].payload).toStrictEqual(expected);
    });

    it('should call the onError function', async () => {
      api = createApi({ ok: false });
      onError = jest.fn();
      const action = createAction(type, { api, isStateManager });
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(onError).toBeCalledTimes(1);
      expect(onError.mock.calls[0].length).toBe(5);
    });

    it('should call the api function', async () => {
      api = jest.fn().mockReturnValue(createApi()());
      const action = createAction(type, { api, isStateManager });
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(api).toBeCalledTimes(1);
      expect(api).toBeCalledWith(dispatch, getState, extraArgument, action);
    });

    it('should call the apiPreReducer function', async () => {
      const message = 'pre';
      const apiPreReducer = jest.fn().mockReturnValue(message);
      const action = createAction(type, { api, isStateManager, apiPreReducer });
      await managerApi(dispatch, getState, extraArgument, action, onError);
      expect(actionDispatch[0].type).toBe(type);
      expect(actionDispatch[0].payload).toBe(message);
      expect(apiPreReducer).toBeCalledTimes(1);
      expect(apiPreReducer).toBeCalledWith(
        contentApi,
        dispatch,
        getState,
        extraArgument,
        action,
      );
    });

    it('should dispatch the error type', async () => {
      api = createApi({ ok: false });
      const type = 'ERROR';
      const expectedType = 'DISPATCH_TYPE_ON_ERROR';
      const action = createAction(type, {
        api,
        isStateManager,
        dispatchTypeOnError: expectedType,
      });
      await managerApi(dispatch, getState, extraArgument, action, undefined);

      expect(actionDispatch[0].type).toStrictEqual(expectedType);
    });
  });
});
