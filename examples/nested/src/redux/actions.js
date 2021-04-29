import { createAction } from 'hideaway';

export const updateBooks = (title, author) => {
  const titleValue = title === '' ? 'Unknown' : title;
  const authorValue = author === '' ? 'Unknown' : author;

  return createAction('UPDATE_BOOKS', {
    keys: { titleValue }, // The key replace the item on the path if it matches
    path: ['titles', 'titleValue', 'authorList'],
    payload: authorValue,
  });
};

// Example without using API and createAction
export const resetBooks = () => ({ type: 'RESET_BOOKS' });
