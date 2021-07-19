import { AnyAction, Reducer } from 'redux';
import { HIDEAWAY } from './constants';
import {
  HideawayAction,
  HideawayDispatch,
  OnError,
  Reducers,
  TObject,
} from './contracts';
import { deepCopy, has, isObject, omit } from './utils';

type ManagerReducer = (
  prefix: string,
  reducer: Reducer,
) => {
  [type: string]: Reducer;
};

export const managerApi = (
  dispatch: HideawayDispatch,
  getState: any,
  extraArgument: TObject | undefined,
  action: AnyAction,
  onError: OnError | undefined,
) => {
  const { isStateManager, api } = action[HIDEAWAY];
  let result = null;

  if (!api) return;

  if (isStateManager) {
    result = stateManagerType(
      dispatch,
      getState,
      extraArgument,
      action,
      onError,
    );
  } else {
    result = normalType(dispatch, getState, extraArgument, action, onError);
  }
  return result;
};

export const normalType = (
  dispatch: HideawayDispatch,
  getState: any,
  extraArgument: TObject | undefined,
  action: AnyAction,
  onError: OnError | undefined,
) => {
  const { type } = action;
  const { api, apiPreReducer, dispatchTypeOnError } = action[HIDEAWAY];
  const cleanAction = omit(action, [HIDEAWAY, 'type', 'payload']);
  cleanAction[HIDEAWAY] = deepCopy(omit(action[HIDEAWAY], ['api']));

  let newAction: HideawayAction = { type, ...cleanAction };

  return api(dispatch, getState, extraArgument, action)
    .then((response: Response) => {
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        return contentType.indexOf('application/json') !== -1
          ? response.json()
          : response.text();
      }
      throw response;
    })
    .then((payload: any) => {
      newAction = {
        ...cleanAction,
        type: `${type}`,
        payload: apiPreReducer
          ? apiPreReducer(payload, dispatch, getState, extraArgument, action)
          : payload,
      };
      dispatch(newAction);
      return newAction;
    })
    .catch((reason: Response) => {
      let newPayload = reason;
      if (onError !== undefined) {
        newPayload = onError(reason, dispatch, getState, extraArgument, action);
      }
      newAction = {
        ...cleanAction,
        type: dispatchTypeOnError || type,
        payload: newPayload,
      };
      if (!!dispatchTypeOnError) {
        dispatch(newAction);
      }
    });
};

export const stateManagerType = (
  dispatch: HideawayDispatch,
  getState: any,
  extraArgument: TObject | undefined,
  action: AnyAction,
  onError: OnError | undefined,
) => {
  const { type } = action;
  const { api, apiPreReducer, ...apiRest } = action[HIDEAWAY];
  const cleanAction = omit(action, [HIDEAWAY, 'type', 'payload']);
  let newAction: HideawayAction = {
    type: `${type}_REQUEST`,
    HIDEAWAY: apiRest,
  };
  dispatch(newAction);

  return api(dispatch, getState, extraArgument, action)
    .then((response: Response) => {
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        return contentType.indexOf('application/json') !== -1
          ? response.json()
          : response.text();
      }
      throw response;
    })
    .then((payload: any) => {
      newAction = {
        ...cleanAction,
        HIDEAWAY: apiRest,
        type: `${type}_RESPONSE`,
        payload: apiPreReducer
          ? apiPreReducer(payload, dispatch, getState, extraArgument, action)
          : payload,
      };
      dispatch(newAction);
    })
    .catch((reason: Response) => {
      let newPayload = reason;
      if (onError !== undefined) {
        newPayload = onError(reason, dispatch, getState, extraArgument, action);
      }
      newAction = {
        ...cleanAction,
        HIDEAWAY: apiRest,
        type: `${type}_ERROR`,
        payload: newPayload,
      };
      dispatch(newAction);
    });
};

const loadingReducer: ManagerReducer = (prefix) => ({
  [`${prefix}_REQUEST`]: () => true,
  [`${prefix}_RESPONSE`]: () => false,
  [`${prefix}_ERROR`]: () => false,
});

const valueReducer: ManagerReducer = (prefix, reducer) => ({
  [`${prefix}_REQUEST`]: (state) => state,
  [`${prefix}_RESPONSE`]: reducer,
});

const errorReducer: ManagerReducer = (prefix) => ({
  [`${prefix}_RESPONSE`]: () => null,
  [`${prefix}_ERROR`]: (_, { payload }) => payload,
});

const createReducerStateManager = (prefix: string, reducer: Reducer) => {
  const loading = loadingReducer(prefix, reducer);
  const value = valueReducer(prefix, reducer);
  const error = errorReducer(prefix, reducer);

  return {
    loading: prepareReducer(false, loading),
    value: prepareReducer(null, value),
    error: prepareReducer(null, error),
  };
};

export const generateStateManager = (prefix: string, reducer: Reducer) => {
  const stateReducer = createReducerStateManager(prefix, reducer);
  return combineShallow(stateReducer);
};

const prepareReducer =
  (initialState: any, reducers: Reducers) =>
  (state: any, action: HideawayAction) => {
    if (Object.prototype.hasOwnProperty.call(reducers, action.type)) {
      return reducers[action.type](state, action);
    }
    return state;
  };

/**
 * Message from `combineReducers`
 * {@link https://github.com/reduxjs/redux/blob/master/src/combineReducers.ts}
 */
export const getUndefinedStateErrorMessage = (
  key: string,
  action: HideawayAction,
) => {
  const actionType = action && action.type;
  const actionDescription =
    (actionType && `action "${String(actionType)}"`) || 'an action';

  return (
    `Given ${actionDescription}, reducer "${key}" returned undefined. ` +
    `To ignore an action, you must explicitly return the previous state. ` +
    `If you want this reducer to hold no value, you can return null instead` +
    ` of undefined.`
  );
};

/**
 * Simplified version of `combineReducers`
 * {@link https://github.com/reduxjs/redux/blob/master/src/combineReducers.ts}
 */
const combineShallow =
  /* istanbul ignore next */
  (reducers: Reducers) => (state: any, action: HideawayAction) => {
    const nextState: TObject = {};
    Object.keys(reducers).map((key: string) => {
      const reducer = reducers[key];
      const previousStateForKey = isObject(state) ? state[key] : undefined;
      const nextStateForKey = reducer(previousStateForKey, action);
      if (nextStateForKey === undefined) {
        const errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      return null;
    });
    return nextState;
  };

export const isStateManagerFn = (value: any) => {
  return (
    isObject(value) &&
    has(value, 'loading') &&
    has(value, 'value') &&
    has(value, 'error')
  );
};

export const createStateManager = (value: any) => {
  if (isStateManagerFn(value)) return value;
  return {
    loading: false,
    value,
    error: null,
  };
};
