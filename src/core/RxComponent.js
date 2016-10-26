import React, {Component} from 'react';
import {Subject} from 'rx';

import _ from 'lodash';

export default clazz =>
  (id = Symbol()) => {

    const populateEvent = event => {
      event = JSON.parse(JSON.stringify(event));
      if (!event.from) {
        event.from = [];
      }
      event.from.push(id);
      event.key = event.from
        .reverse()
        .concat(event.type)
        .join(':');
      return event;
    };

    const {
      childs = {},
      store = {},
      events: eventsSpec = {},
      reducer = (store, reducer) => store,
      subStreams$ = []
    } = clazz;

    const events = Object
      .keys(eventsSpec)
      .reduce(
        (memo, eventName) => {
          memo[eventName] = `${id}:${eventsSpec[eventName]}`;
          return memo;
        },
        {}
      );

    const childsStreams$ = _(childs)
      .values()
      .map('stream$')
      .value();

    let stream$ = new Subject();

    if (childsStreams$.length) {
      childsStreams$.forEach(childsStream$ => (stream$ = stream$.merge(childsStream$)));
    }

    if (subStreams$.length) {
      subStreams$.forEach(subStream$ => (stream$ = stream$.merge(subStream$)));
    }

    const populatedStream$ = stream$
      .map(populateEvent);


    const updateStream$ = stream$
      .scan(reducer.bind({childs}), store)
      .filter(state => !_.isEmpty(state))
      .distinctUntilChanged(
        _.identity,
        _.isEqual,
      )
      .share();


    updateStream$
      .forEach(state => console.log(213, state));

    const definition = _.extend(
      clazz,
      {
        id,
        store,
        reducer: reducer.bind({childs}),
        childs,
        events,

        stream$: populatedStream$,
        updateStream$,

        getInitialState() {
          return store;
        },

        componentDidMount() {
          this.subscribtion = updateStream$
            .forEach(this.setState.bind(this));
        },

        componentWillUnmount() {
          this.subscribtion.dispose();
        }

      }
    );
    const RxComponent = React.createClass(definition);

    RxComponent.id = id;
    RxComponent.events = events;
    RxComponent.store = store;
    RxComponent.reducer = reducer.bind({childs});
    RxComponent.childs = childs;
    RxComponent.events = events;

    RxComponent.stream$ = populatedStream$;
    RxComponent.updateStream$ = updateStream$;

    return RxComponent;

  };

