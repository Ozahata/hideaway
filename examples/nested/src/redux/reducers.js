import { createReducer } from 'hideaway';
import { combineReducers } from 'redux';

const booksManagement = createReducer({});

const booksReducers = booksManagement.combine({
  UPDATE_BOOKS: (state, { payload }) => [...(state || []), payload],
  RESET_BOOKS: () => ({}),
});

export const reducers = combineReducers({
  nested: booksReducers,
});
