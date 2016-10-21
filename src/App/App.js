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
    console.log(event)
    store.buttonText1 = 'ho';
    store.buttonText2 = 'hey';
    return store;
  },

  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <p>lol</p>
        <this.childs.myButton text={this.store.buttonText1}></this.childs.myButton>
        <this.childs.myButton text={this.store.buttonText2}></this.childs.myButton>
      </div>
    );
  }

});