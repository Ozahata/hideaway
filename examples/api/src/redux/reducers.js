import { createReducer } from 'hideaway';
import { combineReducers } from 'redux';

// API + State Manager
const stateManager = createReducer(null, { isStateManager: true });

const stateReducers = stateManager.combine({
  REQUEST_STATE_MANAGER: (_, { payload }) => payload.results[0].name,
  CLEAN_STATE_MANAGER: () => null,
});

// API + Nested
const nestedInitialState = 'A/B';

const nested = createReducer(nestedInitialState, { isStateManager: false });

const nestedReducers = nested.combine({
  REQUEST_A: (_, { payload }) => payload.results[0].name,
  REQUEST_B: (state) => (typeof state === 'string' ? 0 : state + 1),
  REQUEST_ERROR: (_, { payload }) => payload,
  CLEAN_NESTED: () => nestedInitialState,
});

// API + State Manager + Nested
const all = createReducer(
  {},
  {
    isStateManager: true,
    nestedInitialState: {},
  },
);

const allReducers = all.combine({
  REQUEST_ALL: (_, { payload }) => payload.results[0].name,
  CLEAN_ALL: () => null, // valuePreStore will override this value
  CLEAN_BY_NAME: () => ({}),
});

// Combine
export const reducers = combineReducers({
  stateManager: stateReducers,
  nested: nestedReducers,
  all: allReducers,
});
