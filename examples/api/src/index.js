import { hideaway } from 'hideaway';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { App } from './App';
import { reducers } from './redux/reducers';

const enhancer = applyMiddleware(hideaway);
const store = createStore(reducers, {}, composeWithDevTools(enhancer));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
