import React from 'react';
import RxComponent from '../core/RxComponent';
import Button from './Button';

export default RxComponent({

  childs: {
    myButton: Button('my-button'),
    myButton2: Button('my-button-2')
  },

  store: {
    buttonText1: 'hey',
    buttonText2: 'ho',
    color: '#000'
  },

  reducer(store, event) {
    switch (event.type) {
      case this.childs.myButton.events.click:
        store.buttonText1 = 'ho';
        store.buttonText2 = 'hey';
        break;
      case this.childs.myButton2.events.click:
        alert('Old school shitty alert!');
        break;
      case this.childs.myButton2.events.hasDoneSomething:
        store.color = "#"+((1<<24)*Math.random()|0).toString(16);
        break;
      default:
    }
    return store;
  },

  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <p>lol</p>
        <this.childs.myButton color={this.state.color} text={this.state.buttonText1}></this.childs.myButton>
        <this.childs.myButton text={this.state.buttonText2}></this.childs.myButton>
        <this.childs.myButton2 text={this.state.buttonText2}></this.childs.myButton2>
      </div>
    );
  }

});