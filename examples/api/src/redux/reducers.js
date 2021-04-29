import { createReducer } from 'hideaway';
import { combineReducers } from 'redux';

const apiStateManager = createReducer(null, { isStateManager: true });

const titlesReducers = apiStateManager.combine({
  REQUEST_LIST: (_, { payload }) => payload.results[0].name,
  CLEAN_LIST: () => null,
  ERROR: (_, { payload }) => payload,
});

const nestedInitialState = 'A/B';

const apiNested = createReducer(nestedInitialState, { isStateManager: false });

const apiNestedReducers = apiNested.combine({
  REQUEST_LIST_A: (_, { payload }) => payload.results[0].name,
  REQUEST_LIST_B: (state) => (typeof state === 'string' ? 0 : state + 1),
  ERROR_LIST: (_, { payload }) => payload,
  CLEAN_LIST: () => nestedInitialState,
});

export const reducers = combineReducers({
  api: titlesReducers,
  apiNested: apiNestedReducers,
});
