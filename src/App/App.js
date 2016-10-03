import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Subject } from 'rx';
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
      lol: 'lol',
      show: false
    };

    static showReducer(store, event) {
      store.lol += ` ${event.lol.name}`;
      if (event.lol.id === 1) {
        store.show = true;
      }
      return store;
    }

    static hideReducer(store, event) {
      store.show = false;
      return store;
    }

    constructor(props) {
      super(props);

      const firstStream$ = App.stream$
        .filter(({ type, from }) => ((type === Button.events.BUTTON_CLICK) && from.join(':') === 'first-button:my-app'))
        .scan(App.showReducer, App.store);

      const secondStream$ = App.stream$
        .filter(({ type, from }) => ((type === Button.events.BUTTON_CLICK) && from.join(':') === 'second-button:my-app'))
        .scan(App.hideReducer, App.store);

      new Subject()
        .merge(firstStream$)
        .merge(secondStream$)
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
          <FirstButton lol={{name: 'ohoh', id: 1}}/>
          <FirstButton lol={{name: 'ahah', id: 2}}/>
          {App.store.show ? <SecondButton/> : undefined}
        </div>
      );
    }

  };

};