import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Subject} from 'rx';
import Button from './Button';

export default (id = Symbol()) => {
  const FirstButton = Button('first-button');
  const SecondButton = Button('second-button');

  const populateEvent = event => {
    event = JSON.parse(JSON.stringify(event));
    if (!event.from) {
      event.from = [];
    }
    event.from.push(id);
    return event;
  };

  return class App extends Component {

    static stream$ = new Subject()
      .merge(FirstButton.stream$)
      .merge(SecondButton.stream$)
      .map(populateEvent);

    static store = {
      FirstButton: FirstButton.store,
      SecondButton: SecondButton.store,
      lol: ''
    };

    static reducer(store, event) {
      switch (event.type) {
        case (FirstButton.BUTTON_CLICK):
          store.lol = `${store.lol} lol`;
          break;
        default:
      }
      return store;
    }

    constructor(props) {
      super(props);

      App.stream$
        .scan(App.reducer, App.store)
        .forEach(this.setState.bind(this));
    }

    render() {
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <p>
            {App.store.lol}
          </p>
          <FirstButton/>
          <FirstButton/>
          <SecondButton/>
        </div>
      );
    }

  };

};