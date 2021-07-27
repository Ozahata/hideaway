import { createAction } from './action';
import { Predicate, valuePreStore } from './contracts';
import {
  IHideawayActionOptions,
  IHideawayActionReducer,
  IHideawayNestedProps,
  IHideawayReducerOptions,
  TFHideawayApi,
  THideawayAny,
  IHideawayCombineOptions,
  TFGetValue,
  TFGetState,
  TFHideawayGetState,
  THideawayAnyObject,
} from './legacyContracts';
import { generateNested, generatePath } from './nested';
import { createReducer } from './reducer';
import { getState, getValue } from './selectors';
import { deepCopy, isObject } from './utils';

export const generateAction = <S = THideawayAny>(
  type: string,
  api: TFHideawayApi | undefined,
  options: IHideawayActionOptions<S> = {},
  newOptions: {
    dispatchTypeOnError?: string;
    valuePreStore?: valuePreStore;
    valueRequest?: any;
    valueError?: any;
    [key: string]: any;
  } = {},
) => {
  const {
    apiPreReducer,
    keys,
    path,
    complement,
    predicate: oldPredicate,
    onError,
    allObject,
    isStateManager = false,
    payload,
  } = options;

  if (allObject) {
    console.error('allObject cannot be emulated, replace with valuePreStore');
  }

  let predicate: Predicate | undefined = undefined;
  if (oldPredicate) {
    console.warn(
      `Predicate has new format, change ${type} when migrate to the new format`,
    );
    predicate = (_, g, e) =>
      oldPredicate(g as TFHideawayGetState<unknown>, e as THideawayAnyObject);
  }

  return createAction(type, {
    api,
    apiPreReducer,
    keys,
    path,
    ...(predicate && { predicate }),
    ...(onError && { onError }),
    ...(isStateManager !== undefined && { isStateManager }),
    ...(complement && { ...complement }),
    ...(payload && { payload }),
    ...(newOptions && { ...newOptions }),
  });
};

export const generateStateManagerAction = <S = THideawayAny>(
  type: string,
  api: TFHideawayApi | undefined,
  options: IHideawayActionOptions<S> = {},
  newOptions: {
    dispatchTypeOnError?: string;
    valuePreStore?: valuePreStore;
    valueRequest?: any;
    valueError?: any;
    [key: string]: any;
  } = {},
) => {
  const {
    apiPreReducer,
    keys,
    path,
    complement,
    predicate: oldPredicate,
    onError,
    allObject,
    isStateManager = true,
    payload,
  } = options;

  if (allObject) {
    console.error('allObject cannot be emulated, replace with valuePreStore');
  }

  let predicate: Predicate | undefined = undefined;
  if (oldPredicate) {
    console.warn(
      `Predicate has new format, change ${type} when migrate to createAction`,
    );
    predicate = (_, g, e) =>
      oldPredicate(g as TFHideawayGetState<unknown>, e as THideawayAnyObject);
  }

  return createAction(type, {
    api,
    apiPreReducer,
    keys,
    path,
    ...(predicate && { predicate }),
    ...(onError && { onError }),
    ...(isStateManager !== undefined && { isStateManager }),
    ...(complement && { ...complement }),
    ...(payload && { payload }),
    ...(newOptions && { ...newOptions }),
  });
};

export const generateNestedLegacy = <S>(
  state: S,
  nested: IHideawayNestedProps,
  value: THideawayAny,
) => {
  const { keys, path } = nested;
  const currPath = generatePath(keys, path);
  const currState = deepCopy(state);
  return generateNested(currState, currPath, value);
};

export class ReducerManagement<S> {
  reducerManager: any;
  reducers: IHideawayActionReducer<S> = {};

  constructor(props: IHideawayReducerOptions<S> = {}) {
    const {
      displayError,
      // initialState forces null because state doesn't allow undefined
      initialState = null,
      isNested,
      hasNested,
      isStateManager,
      nested,
      reducers = {},
      nestedInitialState,
    } = props;
    if (displayError !== undefined) {
      console.error('displayError is not supported, use onError');
    }
    if (hasNested !== undefined) {
      console.error('hasNested is not supported, use valuePreStore');
    }
    this.reducers = reducers;
    let nestState = isNested && isStateManager ? {} : undefined;
    nestState =
      nestedInitialState !== undefined ? nestedInitialState : nestState;
    this.reducerManager = createReducer(initialState, {
      nestedInitialState: nestState,
      ...(isStateManager !== undefined && { isStateManager }),
      ...(nested != undefined && { ...nested }),
    });
  }

  combine = (
    reducers: IHideawayActionReducer<S> = {},
    options: IHideawayCombineOptions = {},
  ) => {
    const { ignoreCheck } = options;
    if (ignoreCheck !== undefined) {
      console.warn(
        'ignoreCheck does not exist anymore (the types can add together)',
      );
    }
    Object.keys(reducers).forEach((name) => {
      this.reducers[name] = reducers[name];
    });
    return this.reducerManager.combine(this.reducers);
  };
}

export class ReducerStateManagement<S> {
  reducerManager: any;
  reducers: IHideawayActionReducer<S> = {};
  isStateManager = false;

  constructor(props: IHideawayReducerOptions<S> = {}) {
    const {
      displayError,
      // initialState forces null because state doesn't allow undefined
      initialState = null,
      isNested,
      hasNested,
      isStateManager = true,
      nested,
      reducers = {},
      nestedInitialState,
    } = props;
    if (displayError !== undefined) {
      console.error('displayError is not supported, use onError');
    }
    if (hasNested !== undefined) {
      console.error('hasNested is not supported, use valuePreStore');
    }
    this.isStateManager = isStateManager;
    this.reducers = reducers;
    const state = isNested && initialState === null ? {} : initialState;
    let nestState = isNested && isStateManager ? {} : undefined;
    nestState =
      nestedInitialState !== undefined ? nestedInitialState : nestState;
    this.reducerManager = createReducer(state, {
      nestedInitialState: nestState,
      ...(isStateManager !== undefined && { isStateManager }),
      ...(nested != undefined && { ...nested }),
    });
  }

  combine = (
    reducers: IHideawayActionReducer<S> = {},
    options: IHideawayCombineOptions = {},
  ) => {
    const { ignoreCheck } = options;
    if (ignoreCheck !== undefined) {
      console.warn(
        'ignoreCheck does not exist anymore (the types can add together)',
      );
    }
    Object.keys(reducers).forEach((name) => {
      this.reducers[name] = reducers[name];
    });
    return this.reducerManager.combine(this.reducers);
  };
}

export const getValueLegacy: TFGetValue = (state, options = {}) => {
  const { path = [], defaultValue = null, nested } = options;
  let newPath = path;
  if (isObject(nested)) {
    const { path: nestedPath, keys: nestedKeys } = nested || {
      keys: {},
      path: [],
    };
    newPath = generatePath(nestedKeys || {}, [...path, ...(nestedPath || [])]);
  }
  return getValue(state, newPath, defaultValue);
};

/**
 * Retrieve the value from state using state manager
 * @param {S} state The state container
 * @param {IHideawaySelectorOptions} options are additional settings
 */
export const getStateLegacy: TFGetState = (state, options = {}) => {
  const { path = [], defaultValue = null, nested } = options;
  let newPath = path;
  if (isObject(nested)) {
    const { path: nestedPath, keys: nestedKeys } = nested || {
      keys: {},
      path: [],
    };
    newPath = generatePath(nestedKeys || {}, [...path, ...(nestedPath || [])]);
  }
  return getState(state, newPath, defaultValue);
};
