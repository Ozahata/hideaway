import { HideawayStateManager } from './contracts';
import { createStateManager } from './manager';
import { pathOr } from './utils';

/**
 * Return the value from the path inside the state.
 * If the path is not found, the detault value will return.
 */
export const getValue = <R>(
  state: any,
  path: string[],
  defaultValue: any = null,
) => pathOr(state, path, defaultValue) as R;

/**
 * Return the value from the path inside the state.
 * If the path is not found, the detault value will return.
 * The value will return in the state manager format.
 */
export const getState = <R>(
  state: any,
  path: string[],
  defaultValue: any = null,
) => {
  const value = pathOr(state, path, defaultValue) as HideawayStateManager<R>;
  return createStateManager(value);
};
