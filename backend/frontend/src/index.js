import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux';
import {configureStore}  from "@reduxjs/toolkit";
import rootReducer from './Reducers/rootReducer';
import {ErrorBoundary} from 'react-error-boundary'
import ErrorView from '../src/component/ErrorView'
const root = ReactDOM.createRoot(document.getElementById('root'));
const store=configureStore({
  reducer:rootReducer
})
root.render(
  <ErrorBoundary FallbackComponent={
    <ErrorView></ErrorView>
 }>
  <Provider store={store}>
    <App />
    </Provider>
    </ErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
