import { Action, AnyAction, Reducer, Dispatch } from 'redux';

export interface Reducers {
  /**
   * A Map of reducers.
   */
  [type: string]: Reducer;
}

export interface HideawayDispatch<A extends Action<any> = HideawayAction>
  extends Dispatch<A> {
  /**
   * A *dispatching function* (or simply *dispatch function*) is a function that
   * accepts an action; it then may or may not dispatch the actions to the store.
   */
  (dispatch: Dispatch<A>, getState: Function): any;
}

export type Api = (
  /**
   * A *dispatching function* (or simply *dispatch function*) is a function that
   * accepts an action; it then may or may not dispatch the actions to the store.
   */
  dispatch: HideawayDispatch,
  /**
   * Return the state inside the store.
   */
  getState: Function,
  /**
   * The arguments from the middleware options.
   */
  extraArgument: TObject | undefined,
  /**
   * It is a plain JavaScript object that describes what happened.
   */
  action: HideawayAction,
) => void;

export type ApiPreReducer = (
  /**
   * The content from the response.
   */
  body: any,
  /**
   * A *dispatching function* (or simply *dispatch function*) is a function that
   * accepts an action; it then may or may not dispatch the actions to the store.
   */
  dispatch: HideawayDispatch,
  /**
   * Return the state inside the store.
   */
  getState: Function,
  /**
   * The arguments from the middleware options.
   */
  extraArgument: TObject | undefined,
  /**
   * It is a plain JavaScript object that describes what happened.
   */
  action: HideawayAction,
) => any;

export type valuePreStore = (
  /**
   * The original state.
   */
  state: any,
  /**
   * An *action* is a plain object that represents an intention to change the
   * state.
   */
  action: HideawayAction,
  /**
   * The values from the reducer.
   */
  value: any,
) => any;

export type Predicate = (
  /**
   * A *dispatching function* (or simply *dispatch function*) is a function that
   * accepts an action; it then may or may not dispatch the actions to the store.
   */
  dispatch: HideawayDispatch,
  /**
   * Return the state inside the store.
   */
  getState: Function,
  /**
   * The arguments from the middleware options.
   */
  extraArgument: TObject | undefined,
  /**
   * It is a plain JavaScript object that describes what happened.
   */
  action: HideawayAction,
) => boolean;

export type OnError = (
  /**
   * The response from the API.
   */
  reason: Response,
  /**
   * A *dispatching function* (or simply *dispatch function*) is a function that
   * accepts an action; it then may or may not dispatch the actions to the store.
   */
  dispatch: HideawayDispatch,
  /**
   * Return the state inside the store.
   */
  getState: Function,
  /**
   * The arguments from the middleware options.
   */
  extraArgument: TObject | undefined,
  /**
   * It is a plain JavaScript object that describes what happened.
   */
  action: HideawayAction,
) => any;

export type TObject<R = any> = { [s: string]: R };

export interface HideawayAction extends AnyAction {
  /**
   * The value to send to the store.
   */
  payload?: any;
}

export interface HideawayStateManager<R> {
  loading: boolean;
  value: R;
  error: string | null;
}
