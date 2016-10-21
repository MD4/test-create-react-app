import React, {Component} from 'react';
import {Subject} from 'rx';
import RxComponent from '../core/RxComponent';

const buttonStream$ = new Subject();

export default RxComponent({

  subStreams$: [
    buttonStream$.debounce(250)
  ],

  store: {
    clicksCount: 0
  },

  propTypes: {
    text: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      text: 'A button !'
    };
  },

  reducer(store, event) {
    store.clicksCount++;
    return store;
  },

  handleOnButtonClick() {
    buttonStream$.onNext({lol: 123});
  },

  render() {
    return (
      <button
        type="button"
        onClick={this.handleOnButtonClick}
      >
        {this.props.text}
        ({this.store.clicksCount})
      </button>
    );
  }

});