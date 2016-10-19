import React from 'react';
import ReactDOM from 'react-dom';
import Lol from './Lol/Lol';

const MyLol = Lol('my-lol');

console.log(213, MyLol.stream$);

ReactDOM.render(
  <MyLol/>,
  document.getElementById('root')
);

const store = {
  MyApp: MyLol.store
};
MyLol
  .stream$
  .forEach(event => console.log(event, store));