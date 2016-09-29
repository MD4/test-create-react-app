import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Subject } from 'rx';

class App extends Component {

  constructor(props) {
    super(props);
    const clicks$ = new Subject();

    clicks$
      .buffer(clicks$.debounce(250))
      .map(list =>list.length)
      .filter(x => x >= 2)
      .subscribe(data => console.log(data));

    this.clicks$ = clicks$;
  }

  handleButtonClick() {
    this.clicks$.onNext();
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
        <button type="button" onClick={this.handleButtonClick.bind(this)}>Click me!</button>
      </div>
    );
  }
}

export default App;
