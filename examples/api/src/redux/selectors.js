import { getState, getValue } from 'hideaway';

export const getStateManager = (state) => getState(state, ['stateManager']);

export const getNested = (state) => getValue(state, ['nested'], 'Not Found');

export const getAll = (state) => getValue(state, ['all'], 'Not Found');
