import React from 'react';
import {Subject} from 'rx';
import RxComponent from '../core/RxComponent';

export default RxComponent({

  events: {
    click: 'click',
    mouseMove: 'mouse-move'
  },

  subStreams$: {
    buttonClick$: subStream$ => subStream$,
    buttonMouseMove$: subStream$ => subStream$.debounce(250)
  },

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
    switch (event.type) {
      case this.events.click:
        store.clicksCount++;
        break;
      case this.events.mouseMove:
        store.mousePosition = event.position;
        break;
      default:
    }

    return store;
  },

  handleOnButtonClick() {
    this.subStreams$.buttonClick$.onNext({
      type: this.events.click,
      clicksCount: this.state.clicksCount
    });
  },

  handleOnButtonMouseMove(e) {
    this.subStreams$.buttonMouseMove$.onNext({
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