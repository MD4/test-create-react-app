import React, {Component} from 'react';
import {Subject} from 'rx';

const events = {
  BUTTON_CLICK:'button:click'
};

const Button = (id = Symbol()) => {
  const clicks$ = new Subject();

  const populateEvent = event => {
    event = JSON.parse(JSON.stringify(event));
    if (!event.from) {
      event.from = [];
    }
    event.from.push(id);
    return event;
  };

  return class Button extends Component {
    static stream$ = new Subject()
      .merge(clicks$)
      .map(populateEvent);

    static store = {
      clickCount: 0
    };

    static reducer(store, event) {
      switch(event.type) {
        case (events.BUTTON_CLICK):
          store.clickCount++;
          break;
        default:
      }
      return store;
    }

    constructor(props) {
      super(props);

      Button.stream$
        .scan(Button.reducer, Button.store)
        .forEach(this.setState.bind(this));
    }

    handleButtonClick() {
      clicks$.onNext({type: events.BUTTON_CLICK, id});
    }

    render() {
      return (
        <button type="button" onClick={this.handleButtonClick.bind(this)}>
          {`Click me! (${Button.store.clickCount})`}
        </button>
      );
    }
  };

};

Button.events = events;

export default Button;

