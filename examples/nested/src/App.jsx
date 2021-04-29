import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { resetBooks, updateBooks } from './redux/actions';

const initialState = { title: '', author: '' };

export const App = () => {
  const [fields, setFields] = useState(initialState);
  let store = useSelector((s) => s);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const target = event.target;
    setFields({ ...fields, [target.name]: target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = fields.title || 'Unknown';
    const author = fields.author || 'Unknown';
    dispatch(updateBooks(title, author));
    setFields(initialState);
  };

  const handleReset = (event) => {
    event.preventDefault();
    setFields(initialState);
    dispatch(resetBooks());
  };

  return (
    <div>
      <div className="buttons">
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <label>
            Title:
            <input
              name="title"
              value={fields.title}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Author:
            <input
              name="author"
              value={fields.author}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </form>
      </div>
      <pre>{JSON.stringify(store, null, 4)}</pre>
    </div>
  );
};
