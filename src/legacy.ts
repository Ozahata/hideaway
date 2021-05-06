import { createAction } from './action';
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
} from './legacyContracts';
import { createStateManager } from './manager';
import { generateNested, generatePath } from './nested';
import { createReducer } from './reducer';
import { getState, getValue } from './selectors';
import { deepCopy, isObject } from './utils';

export const generateAction = <S = THideawayAny>(
  type: string,
  api: TFHideawayApi | undefined,
  options: IHideawayActionOptions<S> = {},
) => {
  const {
    apiPreReducer,
    keys,
    path,
    complement,
    predicate,
    onError,
    allObject,
    isStateManager = false,
    payload,
  } = options;

  if (allObject) {
    console.error('allObject cannot be emulated, replace with valuePreStore');
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
  });
};

export const generateStateManagerAction = <S = THideawayAny>(
  type: string,
  api: TFHideawayApi | undefined,
  options: IHideawayActionOptions<S> = {},
) => {
  const {
    apiPreReducer,
    keys,
    path,
    complement,
    predicate,
    onError,
    allObject,
    isStateManager = true,
    payload,
  } = options;

  if (allObject) {
    console.error('allObject cannot be emulated, replace with valuePreStore');
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
    } = props;
    if (displayError !== undefined) {
      console.error('displayError is not supported, use onError');
    }
    if (hasNested !== undefined) {
      console.error('displayError is not supported, use valuePreStore');
    }
    this.reducers = reducers;
    const nestedInitialState = isNested ? null : undefined;
    this.reducerManager = createReducer(initialState, {
      nestedInitialState,
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
      console.log(
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
    } = props;
    if (displayError !== undefined) {
      console.error('displayError is not supported, use onError');
    }
    if (hasNested !== undefined) {
      console.error('displayError is not supported, use valuePreStore');
    }
    this.isStateManager = isStateManager;
    this.reducers = reducers;
    const nestedInitialState = isNested ? null : undefined;
    this.reducerManager = createReducer(initialState, {
      nestedInitialState,
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
      console.log(
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
  let result = getState(state, newPath, defaultValue);
  result = createStateManager(result);
  result.value = result.value || defaultValue;
  return createStateManager(result);
};
