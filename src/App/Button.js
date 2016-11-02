import React from 'react';
import {RxComponent} from 'reactx';

export default () => RxComponent({

  events: {
    click: 'click',
    mouseMove: 'mouse-move',
    hasDoneSomething: 'hasDoneSomething'
  },

  subStreams$: {
    buttonClick$: $ => $,
    buttonMouseMove$: $ => $.debounce(500),
    buttonHasDoneSomething: ($, {buttonClick$, buttonMouseMove$}, {hasDoneSomething}) => $
      .merge(buttonClick$)
      .merge(buttonMouseMove$)
      .map({type: hasDoneSomething})
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
      text: 'A button !',
      color: '#000'
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
    return;
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
        style={{color: this.props.color}}
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