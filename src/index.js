import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import Button from './App/Button';
import './index.css';

const MyApp = App('my-app');

ReactDOM.render(
  <MyApp />,
  document.getElementById('root')
);

MyApp.stream$.filter(
  ({type}) => type === Button.events.BUTTON_CLICK
).forEach(console.log.bind(console));

const store = {
  MyApp: MyApp.store
};

MyApp.stream$.forEach(() => console.log(store));