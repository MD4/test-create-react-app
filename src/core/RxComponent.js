import React from 'react';
import {Subject} from 'rx';

import _ from 'lodash';

export default clazz => {
  return (id = Symbol()) => {

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
      reducer:baseReducer = (store, event) => store,
      subStreams$:baseSubStreams$ = {}
    } = clazz;

    const events = _(eventsSpec)
      .keys()
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

    const subStreams$ = _(baseSubStreams$)
      .keys()
      .reduce(
        (memo, subStreamName) => {
          memo[subStreamName] = baseSubStreams$[subStreamName]();
          return memo;
        },
        {}
      );

    const subStreamsToMerge$ = _
      .values(subStreams$);

    let stream$ = new Subject();

    if (childsStreams$.length) {
      childsStreams$.forEach(childsStream$ => (stream$ = stream$.merge(childsStream$)));
    }

    if (subStreamsToMerge$.length) {
      subStreamsToMerge$.forEach(subStream$ => (stream$ = stream$.merge(subStream$)));
    }

    const populatedStream$ = stream$
      .map(populateEvent);

    const reducer = (store, event) => baseReducer
      .bind({
        id,
        childs,
        events
      })(
        {...store},
        event
      );

    const updateStream$ = stream$
      .scan(reducer, store)
      .filter(state => !_.isEmpty(state))
      .distinctUntilChanged(
        _.identity,
        _.isEqual,
      )
      .share();

    const definition = _.extend(
      {...clazz},
      {
        id,
        events,
        store,
        reducer,
        childs,

        stream$: populatedStream$,
        updateStream$,
        subStreams$,

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
    RxComponent.reducer = reducer;
    RxComponent.childs = childs;
    RxComponent.events = events;

    RxComponent.stream$ = populatedStream$;
    RxComponent.updateStream$ = updateStream$;
    RxComponent.subStreams$ = subStreams$;

    return RxComponent;

  };

}