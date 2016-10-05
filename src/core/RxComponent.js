import React, { Component } from 'react';
import { Subject } from 'rx';

export default (store, childs, reducer) =>
  (id = Symbol()) => {

    const populateEvent = event => {
      event = JSON.parse(JSON.stringify(event));
      if (!event.from) {
        event.from = [];
      }
      event.from.push(id);
      return event;
    };

    const childsStreams$ = childs
      .keys()
      .map(key => childs[key].stream$);

    const stream$ = new Subject()
      .merge(childsStreams$)
      .map(populateEvent);

    const updateStream$ = stream$
      .scan(reducer, store)
      .share();

    return class RxComponent extends Component {

      static stream$ = stream$;
      static store = store;

      componentDidMount() {
        this.subscribtion = updateStream$
          .forEach(this.setState.bind(this));
      }

      componentWillUnmount() {
        this.subscribtion.dispose();
      }

    };

  };

