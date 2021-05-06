import { TFHideawayReducer } from '../../../src/legacyContracts';
import { TTestState } from './common';

export const testReducer: TFHideawayReducer<TTestState> = (state, action) =>
  action.text || state;
