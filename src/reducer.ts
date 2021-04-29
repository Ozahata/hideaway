import { HIDEAWAY } from './constants';
import { HideawayAction, Reducers, TObject } from './contracts';
import { generateNested, generatePath } from './nested';
import { has, isObject, pathOr, deepCopy, isNull } from './utils';
import {
  createStateManager,
  generateStateManager,
  isStateManagerFn,
} from './manager';
import { Reducer } from 'redux';

interface ReducerArgs {
  /**
   * Make the API request and manage the process, returning the following
   * parameters:
   * @param loading Return true when run the API and false when the API returns
   * the response
   * @param value Return the content from the response. The response returns as
   * JSON format when the 'content-type' set to 'application/json.'
   * @param error Return the error when the request fails
   */
  isStateManager?: boolean;

  /**
   * The initial value when it does not find the path.
   * PS: to nested works with state manager, this value must be true.
   */
  nestedInitialState?: any;
}

/**
 * Return a function to combine the reducers.
 * @param initialState The starting state. It is null by default.
 * @param options Map of options to customize the reducer.
 */
export const createReducer = (
  initialState: any = null,
  options: ReducerArgs = {},
) => {
  const { isStateManager, nestedInitialState } = options;
  const reducersMap: TObject = {};

  /**
   * Combine the map of reducer and return one reducer.
   * @param reducers Map of reducers
   * @returns Reducer
   */
  const combine = (reducers: Reducers): any => {
    Object.keys(reducers).forEach((name) => {
      if (isStateManager) {
        reducersMap[name] = generateStateManager(name, reducers[name]);
      } else {
        reducersMap[name] = reducers[name];
      }
    });
    return compose();
  };

  const callReducer = (
    reducer: Reducer,
    state: any,
    action: HideawayAction,
  ) => {
    let currState = isObject(state) ? deepCopy(state) : state;
    let currPath: string[] = [];

    const { path, valuePreStore } = action[HIDEAWAY] || {};
    const isNested =
      (Array.isArray(path) && path.length > 0) ||
      nestedInitialState !== undefined;

    if (isNested) {
      const { path, keys } = action[HIDEAWAY];
      const defaultValue = nestedInitialState || null;
      currPath = generatePath(keys, path);
      currState = pathOr(currState, currPath, defaultValue);
    }
    if (isStateManager && !isStateManagerFn(currState)) {
      currState = createStateManager(currState);
    }

    let value = reducer(currState, action);
    const preNestedValue = value;

    if (isNested) {
      // It should include inside the original state
      value = generateNested(state, currPath, value);
    }

    if (valuePreStore) {
      value = valuePreStore(value, action, preNestedValue);
    }

    if (isNested && typeof value === 'object') {
      // When the curentState is an object, it is the same state
      return { ...value };
    }
    return value;
  };

  const removeState = (type: string) =>
    type.replace(/_(REQUEST|RESPONSE|ERROR)$/g, '');

  const getInitialState = (state: any) => {
    const isNested = nestedInitialState !== undefined;

    if (isStateManager && !isStateManagerFn(state) && !isNested) {
      return createStateManager(state || initialState);
    }
    if (isNested) {
      if (isStateManager && isStateManagerFn(state)) {
        return {};
      }
      return isObject(state) ? state : initialState;
    }
    return isNull(state) ? initialState : state;
  };

  const compose = () => (state: any, action: HideawayAction) => {
    // Call 3 times for both because is the redux test
    // https://github.com/reduxjs/redux/issues/382

    let currentState = getInitialState(state);

    const { type } = action;
    const hasActionType = has(reducersMap, type);
    const stateManagerType = removeState(type);
    const hasStateManagerType = has(reducersMap, stateManagerType);

    if (hasActionType) {
      currentState = callReducer(reducersMap[type], currentState, action);
    } else if (hasStateManagerType) {
      currentState = callReducer(
        reducersMap[stateManagerType],
        currentState,
        action,
      );
    }
    return currentState;
  };

  return { combine, callReducer };
};
