import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import './index.css';

const MyApp = App('my-app');

ReactDOM.render(
  <MyApp/>,
  document.getElementById('root')
);

const store = {
  MyApp: MyApp.store
};

MyApp
  .stream$
  .forEach(event => console.log(event, store));