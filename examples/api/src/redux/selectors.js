import { getState, getValue } from 'hideaway';

export const getListState = (state) => getState(state, ['api']);

export const getList = (state) => getValue(state, ['apiNested'], 'Not Found');
