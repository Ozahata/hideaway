import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import {
  cleanAll,
  cleanAllByName,
  cleanNested,
  cleanStateManagerList,
  fetchAll,
  fetchAllError,
  fetchError,
  fetchErrorA,
  fetchErrorB,
  fetchList,
  fetchListA,
  fetchListB,
} from './redux/actions';
import { getAll, getNested, getStateManager } from './redux/selectors';

export const App = () => {
  const store = useSelector((s) => s);
  const stateString = JSON.stringify(getStateManager(store), null, 4);
  const storeString = JSON.stringify(store, null, 4);
  const nestedString = JSON.stringify(getNested(store), null, 4);
  const allString = JSON.stringify(getAll(store), null, 4);

  const dispatch = useDispatch();

  // API + State Manager
  const handleFetchList = () => dispatch(fetchList());
  const handleFetchError = () => dispatch(fetchError());
  const handleClearStateManager = () => dispatch(cleanStateManagerList());

  // API + Nested
  const handleFetchA = () => dispatch(fetchListA());
  const handleFetchB = () => dispatch(fetchListB());
  const handleErrorA = () => dispatch(fetchErrorA());
  const handleErrorB = () => dispatch(fetchErrorB());
  const handleClearNested = () => dispatch(cleanNested());

  // API + Nested + State Manager
  const handleFetchC = () => dispatch(fetchAll('C'));
  const handleFetchCError = () => dispatch(fetchAllError('C'));
  const handleFetchD = () => dispatch(fetchAll('D'));
  const handleFetchDError = () => dispatch(fetchAllError('D'));
  const handleClearAll = () => dispatch(cleanAll());
  const handleClearC = () => dispatch(cleanAllByName('C'));
  const handleClearD = () => dispatch(cleanAllByName('D'));

  return (
    <div>
      <h1>API Call</h1>
      <div className="buttons">
        <button onClick={handleFetchList}>Load data</button>
        <button onClick={handleFetchError}>Error data</button>
        <button onClick={handleClearStateManager}>Clear data</button>
      </div>
      <div className="selectors">
        <div>State manager: {stateString}</div>
      </div>
      <div className="buttons">
        <button onClick={handleFetchA}>Load data A</button>
        <button onClick={handleErrorA}>Error A</button>
      </div>
      <div className="buttons">
        <button onClick={handleFetchB}>Load data B</button>
        <button onClick={handleErrorB}>Error B</button>
      </div>
      <div className="buttons">
        <button onClick={handleClearNested}>Clear data</button>
      </div>
      <div className="selectors">
        <div>Nested: {nestedString}</div>
      </div>
      <div className="buttons">
        <button onClick={handleFetchC}>Load data C</button>
        <button onClick={handleFetchCError}>Error C</button>
        <button onClick={handleClearC}>Clear C</button>
      </div>
      <div className="buttons">
        <button onClick={handleFetchD}>Load data D</button>
        <button onClick={handleFetchDError}>Error D</button>
        <button onClick={handleClearD}>Clear D</button>
      </div>
      <div className="buttons">
        <button onClick={handleClearAll}>Clear data</button>
      </div>
      <div className="selectors">
        <div>All: {allString}</div>
      </div>
      <div className="store">
        <pre>store: {storeString}</pre>
      </div>
    </div>
  );
};
