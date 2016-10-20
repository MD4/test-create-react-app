import React, {Component} from 'react';
import RxComponent from '../core/RxComponent';
import Button from './Button';

export default RxComponent({

  childs: {
    myButton: Button('my-button')
  },

  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <p>lol</p>
        <this.childs.myButton text="lolilol"></this.childs.myButton>
      </div>
    );
  }

});