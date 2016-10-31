import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import './index.css';

const MyApp = App('my-app');

ReactDOM.render(
  <MyApp/>,
  document.getElementById('root')
);