import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import {
  cleanList,
  fetchError,
  fetchErrorA,
  fetchErrorB,
  fetchList,
  fetchListA,
  fetchListB,
} from './redux/actions';
import { getList, getListState } from './redux/selectors';

export const App = () => {
  const store = useSelector((s) => s);
  const stateString = JSON.stringify(getListState(store), null, 4);
  const storeString = JSON.stringify(store, null, 4);
  const nestedString = JSON.stringify(getList(store), null, 4);

  const dispatch = useDispatch();

  const handleFetchList = () => {
    dispatch(fetchList());
  };

  const handleFetchError = () => {
    dispatch(fetchError());
  };

  const handleClear = () => {
    dispatch(cleanList());
  };

  const handleFetchA = () => {
    dispatch(fetchListA());
  };

  const handleFetchB = () => {
    dispatch(fetchListB());
  };

  const handleErrorA = () => {
    dispatch(fetchErrorA());
  };

  const handleErrorB = () => {
    dispatch(fetchErrorB());
  };

  return (
    <div>
      <div className="buttons">
        <button onClick={handleFetchList}>Load data</button>
        <button onClick={handleClear}>Clear data</button>
        <button onClick={handleFetchError}>Error data</button>
      </div>
      <div className="buttons">
        <button onClick={handleFetchA}>Load data A</button>
        <button onClick={handleFetchB}>Load data B</button>
        <button onClick={handleErrorA}>Error A</button>
        <button onClick={handleErrorB}>Error B</button>
      </div>
      <div className="selectors">
        <div>api value: {stateString}</div>
        <div>api nested value A: {nestedString}</div>
      </div>
      <div className="store">
        <pre>store: {storeString}</pre>
      </div>
    </div>
  );
};
