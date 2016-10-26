import React, {Component} from 'react';
import RxComponent from '../core/RxComponent';
import Button from './Button';

export default RxComponent({

  childs: {
    myButton: Button('my-button')
  },

  store: {
    buttonText1: 'hey',
    buttonText2: 'ho'
  },

  reducer(store, event) {
    const newStore = {...store};
    switch(event.type) {
      case this.childs.myButton.events.click:
        newStore.buttonText1 = 'ho';
        newStore.buttonText2 = 'hey';
        break;
    }
    return newStore;
  },

  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <p>lol</p>
        <this.childs.myButton text={this.state.buttonText1}></this.childs.myButton>
        <this.childs.myButton text={this.state.buttonText2}></this.childs.myButton>
      </div>
    );
  }

});