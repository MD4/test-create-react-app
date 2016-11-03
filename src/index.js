import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const App = require('./App/App').default;

const MyApp = App()('my-app');
const MyApp2 = App()('my-app-2');

ReactDOM.render(
  <div>
    <MyApp/>
    <MyApp2/>
  </div>,
  document.getElementById('root')
);