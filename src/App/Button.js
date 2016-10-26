import React, {Component} from 'react';
import {Subject} from 'rx';
import RxComponent from '../core/RxComponent';

const buttonClick$ = new Subject();
const buttonMouseMove$ = new Subject();

export default RxComponent({

  events: {
    click: 'click',
    mouseMove: 'mouse-move'
  },

  subStreams$: [
    buttonClick$,
    buttonMouseMove$.debounce(250)
  ],

  store: {
    clicksCount: 0,
    mousePosition: {x: 0, y: 0}
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

    switch (event.type) {
      case this.events.click:
        newStore.clicksCount++;
        break;
      case this.events.mouseMove:
        newStore.mousePosition = event.position;
        console.log(event);
        break;
    }

    return newStore;
  },

  handleOnButtonClick() {
    buttonClick$.onNext({
      type: this.events.click,
      clicksCount: this.state.clicksCount
    });
  },

  handleOnButtonMouseMove(e) {
    console.log(e);
    buttonMouseMove$.onNext({
      type: this.events.mouseMove,
      position: {
        x: e.clientX,
        y: e.clientY
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
        [{this.state.mousePosition.x}:{this.state.mousePosition.y}]
      </button>
    );
  }

});