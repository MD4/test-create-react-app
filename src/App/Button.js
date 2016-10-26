import React, {Component} from 'react';
import {Subject} from 'rx';
import RxComponent from '../core/RxComponent';

const buttonClick$ = new Subject();
const buttonMouseMove$ = new Subject();

export default RxComponent({

  events: {
    click: 'click'
  },

  subStreams$: [
    buttonClick$,
    buttonMouseMove$.debounce(250)
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
    const newStore = {...store};

    newStore.clicksCount++;

    return newStore;
  },

  handleOnButtonClick() {
    buttonClick$.onNext({
      type: this.events.click,
      clicksCount: this.state.clicksCount
    });
  },

  handleOnButtonMouseMove(e) {
    buttonMouseMove$.onNext({
      type: 'mouse-move',
      position: {
        x: e.x,
        y: e.y
      }
    });
  },

  render() {
    return (
      <button
        type="button"
        onClick={this.handleOnButtonClick}
        onMouseMove={this.handleOnButtonMouseMove}
      >
        {this.props.text}
        ({this.state.clicksCount})
      </button>
    );
  }

});