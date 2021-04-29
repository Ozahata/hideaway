import { createAction, generateNested, isObject, pathOr } from 'hideaway';

const url = 'https://randomuser.me/api';

export const fetchList = () =>
  createAction('REQUEST_LIST', {
    api: () => fetch(url),
    isStateManager: true,
    onError: (reason) => {
      return reason.message;
    },
  });

export const fetchError = () =>
  createAction('REQUEST_LIST', {
    api: () => fetch('https://wrong'),
    isStateManager: true,
    onError: (reason) => reason.message,
  });

export const fetchListA = () => {
  return createAction('REQUEST_LIST_A', {
    api: () => fetch(url),
    keys: { 1: 'sub-item' },
    isStateManager: false,
    path: ['root', 'A list', '1'],
  });
};

export const fetchErrorA = () =>
  createAction('REQUEST_LIST_A', {
    api: () => fetch('https://wrong'),
    isStateManager: false,
    path: ['root', 'A list', 'error'],
    onError: (reason) => {
      return reason.message;
    },
    dispatchTypeOnError: 'ERROR_LIST', // [optional] Send to the reducer
  });

export const fetchListB = () =>
  createAction('REQUEST_LIST_B', {
    api: () => fetch(url),
    isStateManager: false,
    path: ['root', 'B list', '2', 'f'],
    keys: { f: 3 },
    valuePreStore: (state, _action, value) => {
      if (isObject(state)) {
        const path = ['root', 'A list', 'sub-item1'];
        let value = pathOr(state, path, 0);
        const newValue = generateNested(state, path, ++value);
        return newValue;
      }
      return value;
    },
  });

export const fetchErrorB = () =>
  createAction('REQUEST_LIST_B', {
    api: () => fetch('https://wrong'),
    isStateManager: false,
    path: ['root', 'B list', 'sub-item1', 'error'],
    onError: (reason) => {
      return reason.message;
    },
    dispatchTypeOnError: 'ERROR_LIST', // [optional] Send to the reducer
  });

export const cleanList = () =>
  createAction(
    'CLEAN_LIST_RESPONSE', // Use RESPONSE if it doesn't request the API
  );
