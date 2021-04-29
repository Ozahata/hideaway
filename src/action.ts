import { HIDEAWAY } from './constants';
import {
  Api,
  ApiPreReducer,
  HideawayAction,
  OnError,
  Predicate,
  TObject,
  valuePreStore,
} from './contracts';
import { has } from './utils';

interface ActionArgs {
  /**
   * A function that returns a promise.
   */
  api?: Api;
  /**
   * A function that runs before the reducer call.
   */
  apiPreReducer?: ApiPreReducer;
  /**
   * The type name to dispatch when the API doesn't use state manager.
   */
  dispatchTypeOnError?: string;
  /**
   * Make the API request and manage the process, returning the following
   * parameters:
   * @param loading Return true when run the API and false when the API returns
   * the response
   * @param value Return the content from the response. The response returns as
   * JSON format when the 'content-type' set to 'application/json'
   * @param error Return the error when the request fails
   */
  isStateManager?: boolean;
  /**
   * The keys will replace the content of the path.
   */
  keys?: TObject;
  /**
   * The function is triggered if the API returns an error.
   */
  onError?: OnError;
  /**
   * Path used to include the value from the reducer.
   * The path must be a string value.
   */
  path?: string[];
  /**
   * A function that avoids the call if the result returns false.
   */
  predicate?: Predicate;
  /**
   * A function that runs before the value goes to the store.
   */
  valuePreStore?: valuePreStore;
  [key: string]: any;
}

export const ACTION_OPTIONS = [
  'api',
  'isStateManager',
  'path',
  'keys',
  'apiPreReducer',
  'predicate',
  'onError',
  'valuePreStore',
  'dispatchTypeOnError',
];

/**
 * Return the action formatted to the hideaway.
 * @param type The type of action being performed.
 * @param options Map of options to activate the hideaway
 */
export const createAction = (type: string, options: ActionArgs = {}) => {
  const {
    api,
    isStateManager,
    path,
    keys,
    apiPreReducer,
    predicate,
    onError,
    valuePreStore,
    dispatchTypeOnError,
    ...rest
  } = options;
  const action: TObject = { ...rest, type };
  if (ACTION_OPTIONS.some((value) => has(options, value))) {
    action[HIDEAWAY] = {
      ...(isStateManager !== undefined && { isStateManager }),
      ...(dispatchTypeOnError && { dispatchTypeOnError }),
      ...(valuePreStore && { valuePreStore }),
      ...(onError && { onError }),
      ...(predicate && { predicate }),
      ...(api && { api }),
      ...(apiPreReducer && { apiPreReducer }),
      ...(path && { path }),
      ...(keys && { keys }),
    };
  }

  return action as HideawayAction;
};
