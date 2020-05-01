import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Provider } from "react-redux";
import { hideaway } from "hideaway";
import { applyMiddleware, createStore } from "redux";
import { reducers } from "./controllers/reducers";

const middleware = [hideaway()];
const enhancer = applyMiddleware(...middleware);
const store = createStore(reducers, {}, enhancer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
