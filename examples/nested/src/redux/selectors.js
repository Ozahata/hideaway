import { getValue } from 'hideaway';

export const getBooks = (state) => getValue(state, ['nested']);
