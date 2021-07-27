import { AnyAction, Dispatch } from 'redux';

import { HIDEAWAY } from './constants';

export type TFHideawayApiPreReducer<S> = (body: S) => THideawayAny;

export type THideawayAnyObject = {
  [key: string]: THideawayAny;
};

export interface IHideawayNestedProps {
  keys: THideawayAnyObject;
  path: string[];
  allObject?: boolean;
}

export type TFHideawayGetState<S> = () => S;

export interface IHideawayActionContent<S, DispatchExt = {}> {
  type: string;
  api?: TFHideawayApi<S, DispatchExt>;
  apiPreReducer?: TFHideawayApiPreReducer<S>;
  payload?: S;
  nested?: IHideawayNestedProps;
  complement?: THideawayAny;
  predicate?: TFHideawayPredicate;
  onError?: THideawayOnError<S, DispatchExt>;
  response?: Response;
  isStateManager?: boolean;
  [extraProps: string]: any;
}
export type TFHideawayApi<S = THideawayAnyObject, DispatchExt = {}> = (
  dispatch: THideawayDispatch<S, DispatchExt>,
  getState: TFHideawayGetState<S>,
  withExtraArgument?: THideawayAnyObject,
) => typeof Promise.prototype;

export type THideawayAny = any;

export type TFHideawayPredicate = <S>(
  getState: TFHideawayGetState<S>,
  withExtraArgument: THideawayAnyObject,
) => boolean;

export type THideawayOnError<S, DispatchExt = {}> = (
  actionContent: IHideawayActionContent<THideawayAny, DispatchExt>,
  getState: TFHideawayGetState<S>,
  dispatch: THideawayDispatch<S, DispatchExt>,
  onError?: THideawayOnError<S, DispatchExt>,
  withExtraArgument?: THideawayAnyObject,
) => THideawayAny;

export interface IHideawayActionOptions<S = THideawayAny> {
  apiPreReducer?: TFHideawayApiPreReducer<S>;
  keys?: THideawayAnyObject;
  path?: string[];
  allObject?: boolean;
  complement?: THideawayAny;
  predicate?: TFHideawayPredicate;
  onError?: THideawayOnError<S>;
  isStateManager?: boolean;
  payload?: S;
}

export interface IHideawayAction<S = THideawayAnyObject, DispatchExt = {}>
  extends AnyAction {
  [HIDEAWAY]?: IHideawayActionContent<S, DispatchExt>;
}

export interface IHideawayOptions<S, DispatchExt> {
  onError?: THideawayOnError<S, DispatchExt>;
  withExtraArgument?: THideawayAnyObject;
}

export interface IHideawayActionReducer<S = THideawayAny> {
  [action: string]: TFHideawayReducer<S>;
}

export type TFHideawayReducer<S = THideawayAny> = (
  state: S,
  action: THideawayAction,
) => S;

export type THideawayAction<S = THideawayAny, DispatchExt = {}> =
  | AnyAction
  | IHideawayActionContent<S, DispatchExt>;

export interface IHideawayReducerOptions<S> {
  displayError?: boolean;
  initialState?: S | null;
  nested?: IHideawayNestedProps;
  isNested?: boolean;
  hasNested?: boolean;
  isStateManager?: boolean;
  reducers?: IHideawayActionReducer<S>;
  /**
   * The initial value when it does not find the path.
   * PS: to nested works with state manager, this value must be true.
   */
  nestedInitialState?: any;
}

export interface IHideawayCombineOptions {
  ignoreCheck?: boolean;
}

export interface IHideawaySelectorOptions {
  path?: string[];
  defaultValue?: THideawayAny;
  nested?: IHideawayNestedProps;
  isStateManager?: boolean;
}

export type TFGetValue = <R = THideawayAny, S = THideawayAny>(
  state: S,
  options?: IHideawaySelectorOptions,
) => R;

export interface IHideawayStatusManagerOptions<
  R = THideawayAny,
  E = THideawayAny,
> {
  loading?: boolean;
  value?: R;
  error?: E;
  nested?: IHideawayNestedProps;
}

export interface IHideawayStatusManager<R = THideawayAny, E = THideawayAny> {
  loading: boolean;
  value: R;
  error: E;
  nested?: IHideawayNestedProps;
}

export type TFGetState = <R = THideawayAny, S = THideawayAny>(
  state: S,
  options?: IHideawaySelectorOptions,
) => IHideawayStatusManager<R>;

// ******* THUNK *******
export type THideawayDispatch<S, DispatchExt> = Dispatch &
  IThunkDispatch<S, DispatchExt> &
  DispatchExt;

export interface IThunkDispatch<S, DispatchExt = {}> {
  <R>(thunk: IThunk<R, S, DispatchExt>): R;
}

export interface IThunk<R, S, DispatchExt = {}> {
  (
    dispatch: THideawayDispatch<S, DispatchExt>,
    getState: TFHideawayGetState<S>,
  ): R;
}
