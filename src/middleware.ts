import { MiddlewareAPI } from 'redux';
import { HIDEAWAY } from './constants';
import {
  HideawayAction,
  HideawayDispatch,
  OnError,
  TObject,
} from './contracts';
import { managerApi } from './manager';
import { has } from './utils';

interface MiddlewareArgs {
  /**
   * A function that is triggered if the API returns an error.
   */
  onError?: OnError;
  /**
   * Custom argument to be inject in the function.
   * Used by redux-thunk.
   */
  extraArgument?: TObject;
}

export const createHideawayMiddleware = ({
  extraArgument,
  onError: middlewareError,
}: MiddlewareArgs = {}) => {
  return ({ dispatch, getState }: MiddlewareAPI<HideawayDispatch>) =>
    (next: HideawayDispatch) =>
    (action: HideawayAction) => {
      // From https://github.com/reduxjs/redux-thunk/blob/master/src/index.js
      /* istanbul ignore next */
      if (typeof action === 'function') {
        return (action as Function)(dispatch, getState, extraArgument);
      }
      if (has(action, HIDEAWAY) && has(action[HIDEAWAY], 'api')) {
        const { predicate, onError: actionError } = action[HIDEAWAY];
        const onError = actionError || middlewareError;
        const canRunApi = predicate
          ? predicate(dispatch, getState, extraArgument, action)
          : true;
        if (canRunApi) {
          managerApi(dispatch, getState, extraArgument, action, onError);
        }
        return null;
      }
      return next(action);
    };
};

const hideaway = createHideawayMiddleware();

const hideawayWithOptions = createHideawayMiddleware;

export { hideaway, hideawayWithOptions };
