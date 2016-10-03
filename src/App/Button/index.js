import React, {Component} from 'react';
import {Subject} from 'rx';

const events = {
  BUTTON_CLICK:'button:click'
};

const Button = (id = Symbol()) => {
  const populateEvent = event => {
    event = JSON.parse(JSON.stringify(event));
    if (!event.from) {
      event.from = [];
    }
    event.from.push(id);
    return event;
  };

  const clicks$ = new Subject();
  const stream$ = new Subject()
    .merge(clicks$)
    .map(populateEvent);

  const store = {
    clickCount: 0
  };

  const reducer = (store, event) => {
    switch(event.type) {
      case (events.BUTTON_CLICK):
        store.clickCount++;
        break;
      default:
    }
    return store;
  };

  const updateStream$ = stream$
    .scan(reducer, store)
    .share();

  return class Button extends Component {

    static stream$ = stream$;

    static propTypes = {
      data: React.PropTypes.any.required
    };

    componentDidMount() {
      this.subscribtion = updateStream$
        .forEach(this.setState.bind(this));
    }

    componentWillUnmount() {
      this.subscribtion.dispose();
    }

    handleButtonClick() {
      clicks$.onNext({type: events.BUTTON_CLICK, id, data: this.props.data});
    }

    render() {
      return (
        <button type="button" onClick={this.handleButtonClick.bind(this)}>
          {`Click me! (${store.clickCount})`}
        </button>
      );
    }
  };

};

Button.events = events;

export default Button;

