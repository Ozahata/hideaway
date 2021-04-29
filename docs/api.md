# API Reference

# `hideaway`

To enable the hideaway, use (applymiddleware)[https://redux.js.org/api/applymiddleware]

```js
import { createStore, applyMiddleware } from 'redux';
import { hideaway } from 'hideaway';

createStore(reducers, applyMiddleware(hideaway));
```

or injecting a custom argument from [redux-thunk](https://github.com/reduxjs/redux-thunk#injecting-a-custom-argument)

```js
import { createStore, applyMiddleware } from 'redux';
import { hideaway } from 'hideaway';

const store = createStore(
  reducer,
  applyMiddleware(hideaway.withExtraArgument(api)),
);

// later
function fetchUser(id) {
  return (dispatch, getState, api) => {
    // you can use api here
  };
}
```

# `createAction(type, options)`

Format the action to read by the hideaway.

## Arguments

- `type` (string): The type of action
- `options` (object): Additional arguments for the action.
  - `api` (Function): It is a `Reducer` with an additional argument from the hideaway initialization (`withExtraArgument`).
    - Format: `(dispatch, getState, extraArgument, action) => void`
  - `apiPreReducer` (Function): It runs before the reducer call. Useful to update the value before store. The `body` is the content from the API. It returns a JSON file if the `content-type` is `application/json,` or else it returns a string.
    - Format: `(body, dispatch, getState, extraArgument, action) => any`
  - `dispatchTypeOnError` (string): The type name to dispatch when the API doesn't use state manager. It allows working with the error inside the reducer.
  - `isStateManager` (boolean): If true, the hideaway will process as state manager. The state manager can dispatch three types from the original type (`${type}_REQUEST`, `${type}_RESPONSE`, `${type}_ERROR`). The result returns an object with three (loading, value, error).
  - `keys` (object): The keys replace an item from the path if they match. It makes the path readable and easy to use on `apiPreReducer` and `valuePreStore`.
  - `onError` (Function): It is triggered if the API returns an error. The value replaces the payload.
    - Format: `(reason, dispatch, getState, extraArgument, action) => any`
  - `path` (string[]): Create an object to store different objects related to the same resource.
  - `predicate` (Function): Avoid calling the API if the result returns false. One use is to use to prevent the API call if the state contains the value already.
    - Format: `(dispatch, getState, extraArgument, action) => boolean`
  - `valuePreStore` (Function): It runs before the value goes to the store. One use is to clean the nested object.
    - Format: `(state, action, value) => any`
  - - (...rest): It adds in the same level of the type.

## Returns

An action formatted to be read by the hideaway.

# `createReducer(initialState, options)`

Manager the reducers before combining.

## Arguments

- `initialSate` (any): The initial value that the store initialize.
- `options` (object): Additional arguments for the action.
  - `isStateManager` (boolean): If true, the hideaway will process as state manager. The state manager can dispatch three types from the original type (`${type}_REQUEST`, `${type}_RESPONSE`, `${type}_ERROR`). The result returns an object with three (loading, value, error).
  - `nestedInitialState` (boolean): The initial value when it does not find the path. **`NOTE:`** to the nested works with the state manager, this value must be true.

## Returns

An object that contains the method `combine`; The method will register the reducers and compose them to the reducer.

- `combine(reducers)`
  - reducers - an object where the key is the type and the value is the reducer.

# `getValue(state, path, defaultValue) and getState(state, path, defaultValue)`

The only difference between `getValue` and `getState` is that `getState` gets the value and format to the state management format.

## Arguments

- `state` (any): The state from the store.
- `path` (string[]): Create an object to store different objects related to the same resource.
- `defaultValue` (any): It replaces the value if the result is null or undefined.
