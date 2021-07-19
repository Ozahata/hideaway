# Hideaway Middleware [![build status](https://img.shields.io/travis/Ozahata/hideaway/master.svg?style=flat-square)](https://travis-ci.org/Ozahata/hideaway) [![NPM](https://img.shields.io/npm/v/hideaway.svg)](https://www.npmjs.com/package/hideaway)

This middleware standardizes and reduces the code to state managing
(Request, Response, Error,) and/or managing path inside one reducer.

## Why do I need this?

If you want to standardize the use of redux and/or reduce the implementation
of state management (Request, Response, Error).

Use one reducer to maintain a nested object informing the path.

## Installation

```bash
npm install hideaway
```

or

```bash
yarn add hideaway
```

## Examples

This is an interactive version of the code that you can play with online.

- API using the state manager and the nested path:
  [Source](https://github.com/Ozahata/hideaway/tree/master/examples/api) |
  [Sandbox](https://codesandbox.io/s/github/Ozahata/hideaway/tree/master/examples/api)

- Use of nested without API:
  [Source](https://github.com/Ozahata/hideaway/tree/master/examples/nested) |
  [Sandbox](https://codesandbox.io/s/github/Ozahata/hideaway/tree/master/examples/nested)

## Settings

### Store

To enable the hideaway, use
[`applyMiddleware()`](https://redux.js.org/api/applymiddleware):

```js
import { createStore, applyMiddleware } from 'redux';
import { hideaway } from 'hideaway';

createStore(reducers, applyMiddleware(hideaway));
```

or injecting a custom argument from [redux-thunk](https://github.com/reduxjs/redux-thunk#injecting-a-custom-argument)

### Composition

#### Using nested path

`action.js`

```js
import { createAction } from 'hideaway';

export const addDeployment = (clusterName, tenantName, namespaceName, value) =>
  createAction('ADD_DEPLOYMENT', {
    payload: value,
    path: ['clusterName', 'tenantName', 'namespaceName'],
    keys: { clusterName, tenantName, namespaceName },
  });
```

`reducer.js`

```js
import { createReducer } from 'hideaway';
import { combineReducers } from 'redux';

const initialState = {};

const k8sManager = createReducer(initialState);

const k8sReducers = k8sManager.combine({
  ADD_DEPLOYMENT: (state, action) => action.payload,
});

export const reducers = combineReducers({
  k8s: k8sReducers,
});
```

`selector.js`

```js
import { getValue } from 'hideaway';

export const getNamespaces = (state, clusterName, tenantName) => {
  return getValue(state, {
    path: ['clusterName', 'tenantName'],
    keys: { clusterName, tenantName },
  });
};
```

#### API (use of redux-thunk)

`action.js`

```js
import { createAction } from 'hideaway';

export const fetchTenants = (clusterName) =>
  createAction('FETCH_TENANTS', {
    api: () => fetch(`http://<HOST>/${custerName}`),
    path: ['clusterName'],
    keys: { clusterName },
    isStateManager: true,
  });
```

`reducer.js`

```js
import { createReducer } from 'hideaway';
import { combineReducers } from 'redux';

const initialState = {};

const k8sManager = createReducer(initialState, { isStateManager: true });

const k8sReducers = k8sManager.combine({
  FETCH_TENANTS: (_, action) => action.payload,
});

export const reducers = combineReducers({
  k8s: k8sReducers,
});
```

`selector.js`

```js
import { getState } from 'hideaway';

export const getTenants = (state, cluster) => {
  return getState(state, {
    path: ['cluster'],
    keys: { cluster },
  });
};
```

## Documentation

- [API](docs/api.md)
- [FAQ](docs/faq.md)
- [Migration](docs/migration.md)

## Mention

This library is using the following libraries:

- [Redux Thunk - Source](https://github.com/reduxjs/redux-thunk)
- [Lodash](https://lodash.com/) - [Source](https://github.com/lodash/lodash)
- [Ramda](https://ramdajs.com/) - [Source](https://github.com/ramda/ramda)

## License

[MIT](LICENSE)
