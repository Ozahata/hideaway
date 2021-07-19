# Migration

## Version 1 to 2

Version 2 changes the methods as following.

### hideaway

It is not necessary call the hideaway before applyMiddleware

#### Before

```js
import { hideaway } from 'hideaway';

const store = createStore(reducer, applyMiddleware(hideaway()));
```

#### After

```js
import { hideaway } from 'hideaway';

const store = createStore(reducer, applyMiddleware(hideaway));
```

### Action

The `generateAction` was renamed to `createAction`, moving the `api` argument inside the `option` argument.

The `generateStateManagerAction` was removed in favor of a unique and straightforward method.

The `options` has the following changes:

- `apiPreReducer` - It receives additional parameters to have more flexibility.
- `allObject` - It was removed in favor of `valuePreStore`
- `complement` - It was removed since the rest of the values are added in the action.
- `predicate` - It receives the dispatch in the first argument to keep the same format as the api.
- `onError` - The arguments changed the position, and the action was included.

### Reducer

The `ReducerManagement` was renamed to `createReducer`, move the `initialState` to be an argument.

The `ReducerStateManagement` was removed in favor of a unique and straightforward method.

The `options` has the following changes:

- `displayError` - It was removed in favor of `onError`
- `isNested` - It was removed, and now it detects automatically.
- `nest` - It was removed in favor of mounting in the `initialState`
- `hasNested` - It was removed in favor of `valuePreStore`
- `reducers` - It was removed to centralize the reducers using the `combine` method.

#### combineOnly

- The combineOnly method was removed because `valuePreStore` can achieve the same behavior.

### Selector

The options from `getValue` and `getState` became an argument.

The `generateAction` was renamed to `createAction`, moving the `api` argument inside the `option` argument.

The `ReducerManagement` was renamed to `createReducer`, move the `initialState` to be an argument.

The `ReducerStateManagement` was removed in favor of a unique and straightforward method.

The `options` has the following changes:

- `displayError` - It was removed in favor of `onError`
- `isNested` - It was removed and replaced to detect the use of the path field. When working with the state manager, the `nestedInitialState` must be set.
- `nest` - It was removed in favor of mounting in the `initialState`
- `hasNested` - It was removed in favor of `valuePreStore`
- `reducers` - It was removed to centralize the reducers using the `combine` method.
